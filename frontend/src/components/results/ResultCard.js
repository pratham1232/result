import React from 'react';
import { motion } from 'framer-motion';
import { FaIdCard, FaUserTie, FaLightbulb, FaTools } from 'react-icons/fa';
// import StatusBadge from './StatusBadge';
import StatusBadge from '../ui/StatusBadge';
const ResultCard = ({ result, index = 0 }) => {
  const { regId, teamName, teamLeaderName, themeName, problemStatementName, result: resultStatus } = result;

  const glowColor = {
    Selected: 'hover:shadow-green-500/10 hover:border-green-500/30',
    Rejected: 'hover:shadow-red-500/10 hover:border-red-500/30',
    Pending: 'hover:shadow-yellow-500/10 hover:border-yellow-500/30',
    Shortlisted: 'hover:shadow-blue-500/10 hover:border-blue-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`glass rounded-2xl p-6 card-hover cursor-default ${glowColor[resultStatus] || ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3 flex-1 min-w-0">
          {/* Team Name */}
          <h3 className="font-display font-bold text-white text-lg leading-tight truncate">{teamName}</h3>

          {/* Team ID */}
          <div className="flex items-center gap-2 text-sm">
            <FaIdCard className="text-bgi-primary flex-shrink-0" size={13} />
            <span className="text-gray-400">Reg ID:</span>
            <span className="font-mono text-bgi-primary font-semibold">{regId}</span>
          </div>

          {/* Team Leader */}
          <div className="flex items-center gap-2 text-sm">
            <FaUserTie className="text-bgi-secondary flex-shrink-0" size={13} />
            <span className="text-gray-400">Leader:</span>
            <span className="text-gray-200 font-medium truncate">{teamLeaderName}</span>
          </div>

          {/* Theme Name */}
          <div className="flex items-center gap-2 text-sm">
            <FaLightbulb className="text-yellow-400 flex-shrink-0" size={13} />
            <span className="text-gray-400">Theme:</span>
            <span className="text-gray-200 font-medium truncate">{themeName}</span>
          </div>

          {/* Problem Statement */}
          <div className="flex items-start gap-2 text-sm">
            <FaTools className="text-gray-400 flex-shrink-0 mt-1" size={12} />
            <span className="text-gray-400 whitespace-nowrap">Problem:</span>
            <span className="text-gray-300 text-xs mt-0.5 line-clamp-2 leading-relaxed">{problemStatementName}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <StatusBadge status={resultStatus} size="md" />
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className={`mt-5 h-px rounded-full opacity-30 ${
        resultStatus === 'Selected' ? 'bg-green-400' :
        resultStatus === 'Rejected' ? 'bg-red-400' :
        resultStatus === 'Shortlisted' ? 'bg-bgi-primary' :
        'bg-yellow-400'
      }`} />
    </motion.div>
  );
};

export default ResultCard;
