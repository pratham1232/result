import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaTrophy } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen bg-bgi-darker flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-20" />

    <div className="relative z-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <div className="font-display font-black text-[12rem] leading-none text-bgi-primary/10 select-none">
          404
        </div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-6xl mb-6 -mt-8"
        >
          🤖
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="font-display font-black text-4xl text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 font-body text-lg max-w-md mx-auto mb-10">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary px-8 py-4 rounded-xl font-display font-bold flex items-center gap-2 justify-center">
            <FaHome />
            Go Home
          </Link>
          <Link to="/results" className="btn-cyber px-8 py-4 rounded-xl font-display font-bold flex items-center gap-2 justify-center">
            <FaTrophy />
            View Results
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default NotFound;
