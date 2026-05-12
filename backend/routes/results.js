const express = require('express');
const Result = require('../models/Result');

const router = express.Router();

// @route GET /api/results - Public: search & list results
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { regId: searchRegex },
        { teamName: searchRegex }
      ];
    }

    if (status && status !== 'All') {
      query.result = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      results,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/results/stats - Admin stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Result.countDocuments();
    const selected = await Result.countDocuments({ result: 'Selected' });
    const rejected = await Result.countDocuments({ result: 'Rejected' });
    const pending = await Result.countDocuments({ result: 'Pending' });
    const shortlisted = await Result.countDocuments({ result: 'Shortlisted' });

    res.json({ success: true, stats: { total, selected, rejected, pending, shortlisted } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/results/:regId - Public: get single result
router.get('/:regId', async (req, res) => {
  try {
    const result = await Result.findOne({
      regId: req.params.regId.toUpperCase()
    });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/results/:id - Admin: update result
router.put('/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/results/:id - Admin: delete result
router.delete('/:id', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/results - Admin: clear all results
router.delete('/', async (req, res) => {
  try {
    await Result.deleteMany({});
    res.json({ success: true, message: 'All results cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
