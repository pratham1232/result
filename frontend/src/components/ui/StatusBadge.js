import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatusBadge = ({ status, size = 'md' }) => {
  const config = {
    Selected: {
      className: 'badge-selected',
      icon: FaCheckCircle,
      label: 'Selected',
    },
    Rejected: {
      className: 'badge-rejected',
      icon: FaTimesCircle,
      label: 'Rejected',
    },
    Pending: {
      className: 'badge-pending',
      icon: FaClock,
      label: 'Pending',
    },
    Shortlisted: {
      className: 'badge-shortlisted',
      icon: FaStar,
      label: 'Shortlisted',
    },
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2 text-base gap-2.5',
  };

  const cfg = config[status] || config.Pending;
  const Icon = cfg.icon;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full font-display font-semibold tracking-wider ${cfg.className} ${sizeClasses[size]}`}
    >
      <Icon size={size === 'sm' ? 10 : size === 'lg' ? 16 : 12} />
      {cfg.label}
    </motion.span>
  );
};

export default StatusBadge;
