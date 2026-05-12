import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadAPI, resultsAPI } from '../services/api';
import { FaUpload, FaFileExcel, FaCheckCircle, FaTimes, FaDownload, FaArrowLeft, FaInfo, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const UploadResults = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const fileRef = useRef(null);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!passcode) return;

    // Check against the secret key (either from env or default)
    const secretKey = process.env.REACT_APP_UPLOAD_SECRET || 'BGI2025';

    if (passcode === secretKey) {
      setIsAuthorized(true);
      setPasscodeError('');
      toast.success('Access Granted');
    } else {
      setPasscodeError('Invalid Secret Key. Please try again.');
      toast.error('Invalid Secret Key');
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const valid = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls');
    if (!valid) return toast.error('Only Excel files (.xlsx/.xls) are supported');
    if (selectedFile.size > 10 * 1024 * 1024) return toast.error('File size must be under 10MB');

    setFile(selectedFile);
    setUploadResult(null);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setPreview(data.slice(0, 5));
      } catch {
        toast.error('Could not preview file');
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadAPI.uploadExcel(formData, passcode);
      setUploadResult(res.data);
      toast.success(res.data.message);
    } catch (err) {
      if (err.response?.status === 403) {
        setIsAuthorized(false);
        setPasscodeError('Invalid Secret Key. Please try again.');
        toast.error('Invalid Secret Key');
      } else {
        toast.error(err.response?.data?.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL results? This action cannot be undone.')) return;
    
    try {
      await resultsAPI.clearAll();
      toast.success('All results cleared successfully!');
      setUploadResult(null);
    } catch (err) {
      toast.error('Failed to clear results');
    }
  };

  const downloadSample = () => {
    const sampleData = [
      { 'Reg.Id': 'BGI001', 'Team Name': 'Code Warriors', 'Team Leader Name': 'Rahul Sharma', 'Theme Name': 'Smart City', 'Problem Statement Name': 'Traffic Management', 'Result': 'Selected' },
      { 'Reg.Id': 'BGI002', 'Team Name': 'Tech Titans', 'Team Leader Name': 'Priya Singh', 'Theme Name': 'Healthcare', 'Problem Statement Name': 'Disease Prediction', 'Result': 'Rejected' },
      { 'Reg.Id': 'BGI003', 'Team Name': 'Digital Dreamers', 'Team Leader Name': 'Amit Kumar', 'Theme Name': 'Education', 'Problem Statement Name': 'Virtual Classroom', 'Result': 'Pending' },
      { 'Reg.Id': 'BGI004', 'Team Name': 'Cyber Knights', 'Team Leader Name': 'Rohan Gupta', 'Theme Name': 'Cybersecurity', 'Problem Statement Name': 'Phishing Detection', 'Result': 'Shortlisted' },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, 'BGI_Hackathon_Sample.xlsx');
    toast.success('Sample file downloaded!');
  };

  return (
    <div className="min-h-screen bg-bgi-darker pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {!isAuthorized ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-10 max-w-md mx-auto text-center border border-bgi-primary/20 mt-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-bgi-primary/10 border border-bgi-primary/30 flex items-center justify-center mx-auto mb-6">
              <FaUpload className="text-bgi-primary" size={24} />
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2">Secure Upload</h2>
            <p className="text-gray-400 font-body text-sm mb-8">
              This route is protected. Enter the secret access key to continue.
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Secret Access Key"
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setPasscodeError(''); }}
                  className={`w-full bg-bgi-darker/50 border ${passcodeError ? 'border-red-500/50' : 'border-bgi-border'} text-white rounded-xl px-4 py-3 font-mono input-glow`}
                  required
                />
                {passcodeError && (
                  <div className="text-red-400 text-xs mt-2 text-left">{passcodeError}</div>
                )}
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-xl font-display font-bold"
              >
                Access Portal
              </button>
            </form>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-bgi-primary transition-colors text-sm font-mono mb-6">
                <FaArrowLeft size={12} /> Back to Home
              </Link>
              <h1 className="font-display font-black text-4xl text-white">Upload Results</h1>
              <p className="text-gray-400 font-body mt-2">Import Excel file to update hackathon results</p>
            </div>

            {/* Format Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-5 mb-6 border border-bgi-primary/20"
            >
              <div className="flex items-start gap-3">
                <FaInfo className="text-bgi-primary mt-1 flex-shrink-0" size={16} />
                <div>
                  <div className="font-display font-semibold text-white text-sm mb-2">Required Excel Columns</div>
                  <div className="flex flex-wrap gap-2">
                    {['Reg.Id', 'Team Name', 'Team Leader Name', 'Theme Name', 'Problem Statement Name', 'Result'].map(col => (
                      <span key={col} className="px-3 py-1 bg-bgi-primary/10 border border-bgi-primary/30 rounded-full text-bgi-primary text-xs font-mono">
                        {col}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500 text-xs font-mono mt-2">
                    Result values: Selected | Rejected | Pending | Shortlisted
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={downloadSample}
                  className="flex items-center gap-2 text-bgi-primary hover:text-bgi-primary/80 transition-colors text-sm font-mono"
                >
                  <FaDownload size={12} /> Download Sample Excel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-mono"
                >
                  <FaTrash size={12} /> Clear All Data
                </button>
              </div>
            </motion.div>

            {/* Drop Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative glass rounded-3xl p-12 text-center cursor-pointer transition-all border-2 border-dashed ${dragOver
                  ? 'border-bgi-primary bg-bgi-primary/5 scale-[1.02]'
                  : file
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-bgi-border hover:border-bgi-primary/50 hover:bg-bgi-primary/3'
                }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={e => handleFileSelect(e.target.files[0])}
              />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div key="file" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <FaFileExcel className="text-green-400 mx-auto mb-4" size={48} />
                    <div className="font-display font-bold text-white text-lg">{file.name}</div>
                    <div className="text-gray-400 text-sm font-mono mt-1">{(file.size / 1024).toFixed(1)} KB</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setPreview([]); }}
                      className="mt-3 text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 mx-auto"
                    >
                      <FaTimes size={10} /> Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty">
                    <div className="w-20 h-20 rounded-2xl bg-bgi-primary/10 border border-bgi-primary/20 flex items-center justify-center mx-auto mb-5">
                      <FaUpload className="text-bgi-primary" size={28} />
                    </div>
                    <div className="font-display font-bold text-white text-xl mb-2">Drop Excel file here</div>
                    <div className="text-gray-400 font-body">or click to browse</div>
                    <div className="text-gray-600 text-xs font-mono mt-2">.xlsx or .xls · Max 10MB</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Preview */}
            {preview.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 glass rounded-2xl overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-bgi-border">
                  <h3 className="font-display font-semibold text-white text-sm">Preview (first {preview.length} rows)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-bgi-border">
                        {Object.keys(preview[0]).map(key => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-mono text-gray-500 uppercase">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b border-bgi-border/50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-4 py-2 text-gray-300 font-body text-xs">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Upload Button */}
            {file && !uploadResult && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleUpload}
                disabled={uploading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 btn-primary py-5 rounded-2xl text-base font-display font-bold flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-bgi-darker border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaUpload size={16} />
                    Upload & Process Results
                  </>
                )}
              </motion.button>
            )}

            {/* Upload Result */}
            <AnimatePresence>
              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 glass rounded-2xl p-6 border border-green-500/30"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FaCheckCircle className="text-green-400" size={24} />
                    <div>
                      <div className="font-display font-bold text-white">Upload Successful!</div>
                      <div className="text-gray-400 text-sm font-body">{uploadResult.message}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total', value: uploadResult.stats?.total },
                      { label: 'Inserted', value: uploadResult.stats?.inserted },
                      { label: 'Updated', value: uploadResult.stats?.updated },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center bg-green-500/5 rounded-xl p-3">
                        <div className="font-display font-black text-2xl text-green-400">{value}</div>
                        <div className="text-gray-500 text-xs font-mono uppercase">{label}</div>
                      </div>
                    ))}
                  </div>
                  {uploadResult.errors?.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
                      <div className="text-yellow-400 text-xs font-mono">Warnings:</div>
                      {uploadResult.errors.map((e, i) => (
                        <div key={i} className="text-yellow-500/70 text-xs font-mono mt-1">{e}</div>
                      ))}
                    </div>
                  )}
                  <Link
                    to="/results"
                    className="mt-4 btn-primary px-6 py-3 rounded-xl text-sm font-display font-bold inline-flex items-center gap-2"
                  >
                    View Results →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadResults;
