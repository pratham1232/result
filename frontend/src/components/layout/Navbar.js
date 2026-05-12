import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaTrophy } from 'react-icons/fa';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/results', label: 'Results', icon: FaTrophy },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-bgi-primary/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon, isHash, isExternal }) => (
              isExternal ? (
                <a
                  key={label}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10 transition-all duration-200"
                >
                  <Icon size={14} />
                  {label}
                </a>
              ) : isHash ? (
                <a
                  key={label}
                  href={to}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10 transition-all duration-200"
                >
                  <Icon size={14} />
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'text-bgi-primary bg-bgi-primary/10 border border-bgi-primary/30'
                      : 'text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-bgi-primary transition-colors"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong border-t border-bgi-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, icon: Icon, isHash, isExternal }) => (
                isExternal ? (
                  <a
                    key={label}
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10 transition-all font-medium"
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                ) : isHash ? (
                  <a
                    key={label}
                    href={to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10 transition-all font-medium"
                  >
                    <Icon size={16} />
                    {label}
                  </a>
                ) : (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive(to)
                        ? 'text-bgi-primary bg-bgi-primary/10'
                        : 'text-gray-300 hover:text-bgi-primary hover:bg-bgi-primary/10'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
