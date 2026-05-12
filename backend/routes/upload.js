const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Result = require('../models/Result');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Middleware to check secret access key
const requireSecretKey = (req, res, next) => {
  const secretKey = process.env.UPLOAD_SECRET_KEY || 'BGI2025';
  const providedKey = req.headers['x-access-key'];

  if (!providedKey || providedKey !== secretKey) {
    console.warn(`[Auth] Unauthorized upload attempt with key: ${providedKey}`);
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or missing secret access key.' });
  }
  console.log('[Auth] Secret key verified');
  next();
};

// @route POST /api/upload/results
router.post('/results', requireSecretKey, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rawData || rawData.length === 0) {
      return res.status(400).json({ success: false, message: 'Excel file is empty or invalid' });
    }

    // Normalize column names - handle various header formats
    const normalizeKey = (key) => key.toLowerCase().replace(/[\s_-]/g, '');

    const processed = [];
    const errors = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const normalized = {};
      Object.keys(row).forEach(key => {
        normalized[normalizeKey(key)] = String(row[key]).trim();
      });

      const regId = normalized['regid'] || normalized['reg.id'] || normalized['registrationid'];
      const teamName = normalized['teamname'] || normalized['team_name'] || normalized['name'];
      const teamLeaderName = normalized['teamleadername'] || normalized['teamleader'];
      const themeName = normalized['themename'] || normalized['theme'];
      const problemStatementName = normalized['problemstatementname'] || normalized['problemstatement'];
      const resultStatus = normalized['resultstatus'] || normalized['status'] || normalized['result'];

      if (!regId || !teamName) {
        errors.push(`Row ${i + 2}: Missing Reg.Id or Team Name`);
        continue;
      }

      const validStatuses = ['Selected', 'Rejected', 'Pending', 'Shortlisted'];
      const status = validStatuses.find(s => s.toLowerCase() === (resultStatus || '').toLowerCase()) || 'Pending';

      processed.push({
        regId: regId.toUpperCase(),
        teamName,
        teamLeaderName: teamLeaderName || 'N/A',
        themeName: themeName || 'N/A',
        problemStatementName: problemStatementName || 'N/A',
        result: status
      });
    }

    if (processed.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid rows found. Check column headers: Reg.Id, Team Name, Team Leader Name, Theme Name, Problem Statement Name, Result',
        errors
      });
    }

    // Upsert all records
    const ops = processed.map(item => ({
      updateOne: {
        filter: { regId: item.regId },
        update: { $set: item },
        upsert: true
      }
    }));

    const bulkResult = await Result.bulkWrite(ops);

    res.json({
      success: true,
      message: `Successfully processed ${processed.length} records`,
      stats: {
        inserted: bulkResult.upsertedCount,
        updated: bulkResult.modifiedCount,
        total: processed.length
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
