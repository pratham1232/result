import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer id="contact" className="relative border-t border-bgi-border bg-bgi-darker">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex flex-col mb-6">
              <div className="flex items-center gap-1">
                <span className="font-display font-black text-2xl text-white tracking-tighter">BGI</span>
                <span className="font-display font-black text-2xl bg-gradient-to-r from-[#FF0080] to-[#FF8C00] bg-clip-text text-transparent tracking-tighter uppercase">
                  Hackathon
                </span>
              </div>
              <div className="text-[9px] text-gray-300 font-mono font-bold tracking-[0.2em] uppercase leading-none mt-1">
                Vision 2047 | Viksit Bharat
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm font-body">
              A high-energy innovation challenge bringing together students, developers, designers, and entrepreneurs to solve real-world problems using technology.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 rounded-lg border border-bgi-border flex items-center justify-center text-gray-400 hover:text-bgi-primary hover:border-bgi-primary/50 transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/results', label: 'Results' },
                { to: '/admin/login', label: 'Admin Panel' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-bgi-primary transition-colors text-sm font-body flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-bgi-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-bgi-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-body">
            © 2025 BGI Hackathon. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs font-mono">
            Supported by MPSEDC · Vision 2047
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
