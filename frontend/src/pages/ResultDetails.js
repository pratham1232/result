import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, FaIdCard, FaUserTie, FaLightbulb, 
  FaTools, FaDownload, FaShareAlt, FaTrophy 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { resultsAPI } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

const ResultDetails = () => {
  const { regId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Backend has router.get('/:regId') which handles fetching by registration ID
        const res = await resultsAPI.getById(regId);
        setResult(res.data.result);
      } catch (err) {
        toast.error('Result not found or error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [regId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgi-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bgi-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Decoding Result Data...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-bgi-darker flex items-center justify-center pt-20">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Result Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto font-body">
            We couldn't find any hackathon result for Registration ID: <span className="text-bgi-primary">{regId}</span>
          </p>
          <Link to="/results" className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
            <FaArrowLeft /> Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgi-darker pt-24 pb-16 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bgi-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-bgi-secondary/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/results" className="inline-flex items-center gap-2 text-gray-400 hover:text-bgi-primary transition-colors text-sm font-mono mb-8 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to All Results
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl p-8 border border-bgi-primary/20 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <FaTrophy size={120} />
              </div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2 tracking-tight">
                    {result.teamName}
                  </h1>
                  <div className="flex items-center gap-2 text-bgi-primary font-mono">
                    <FaIdCard size={14} />
                    <span>ID: {result.regId}</span>
                  </div>
                </div>
                <StatusBadge status={result.result} size="lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-gray-500 text-xs font-mono uppercase tracking-widest block mb-2">Team Leader</label>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-10 h-10 rounded-xl bg-bgi-secondary/10 border border-bgi-secondary/30 flex items-center justify-center text-bgi-secondary">
                        <FaUserTie />
                      </div>
                      <span className="text-xl font-display font-semibold">{result.teamLeaderName}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 text-xs font-mono uppercase tracking-widest block mb-2">Theme</label>
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                        <FaLightbulb />
                      </div>
                      <span className="text-xl font-display font-semibold">{result.themeName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-xs font-mono uppercase tracking-widest block mb-2">Problem Statement</label>
                  <div className="flex items-start gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-bgi-primary/10 border border-bgi-primary/30 flex items-center justify-center text-bgi-primary mt-1 flex-shrink-0">
                      <FaTools />
                    </div>
                    <p className="text-lg font-body leading-relaxed text-gray-200">
                      {result.problemStatementName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-bgi-border/50 flex flex-wrap gap-4">
                <button 
                  onClick={() => window.print()}
                  className="btn-cyber px-6 py-3 rounded-xl flex items-center gap-2 text-sm"
                >
                  <FaDownload /> Print Certificate
                </button>
                <button 
                  onClick={handleShare}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white flex items-center gap-2 text-sm"
                >
                  <FaShareAlt /> Share Result
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass rounded-3xl p-6 border border-bgi-primary/10">
              <h3 className="text-white font-display font-bold mb-4 flex items-center gap-2">
                <FaInfo className="text-bgi-primary" /> Event Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">Event</span>
                  <span className="text-gray-200">BGI Hackathon 2025</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">Edition</span>
                  <span className="text-gray-200">National Level</span>
                </div>
                <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-200">Bhopal, MP</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FaInfo = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 192 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0z"></path>
  </svg>
);

export default ResultDetails;
