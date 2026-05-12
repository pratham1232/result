import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaTrophy,
  FaArrowRight
} from 'react-icons/fa';

const ParticleField = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-bgi-primary"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.1,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.5, 0.1],
        }}
        transition={{
          duration: 3 + Math.random() * 4,
          repeat: Infinity,
          delay: Math.random() * 3,
        }}
      />
    ))}
  </div>
);

const AnimatedSection = ({ children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {

  return (
    <div className="min-h-screen bg-bgi-darker">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <ParticleField />

        {/* Radial glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(123,47,190,0.05) 40%, transparent 70%)'
          }} />
        </div>

        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[300, 500, 700].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-bgi-primary/10"
              style={{ width: size, height: size }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.5 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6"
          >
            BGI
            <br />
            <span className="gradient-text">HACKATHON</span>
          </motion.h1>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/results" className="btn-primary px-8 py-4 rounded-xl text-base font-display font-bold flex items-center gap-3 justify-center">
              <FaTrophy />
              View Results
              <FaArrowRight />
            </Link>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <div className="text-xs font-mono uppercase tracking-widest">Scroll</div>
          <div className="w-0.5 h-12 bg-gradient-to-b from-bgi-primary to-transparent" />
        </motion.div>
      </section>




      {/* Results CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-bgi-secondary/10 via-bgi-primary/5 to-bgi-accent/10" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bgi-primary/30 bg-bgi-primary/5 text-bgi-primary text-sm font-mono mb-8"
            >
              <FaTrophy />
              Results are Live!
            </motion.div>
            <h2 className="font-display font-black text-5xl md:text-6xl text-white mb-6">
              Check Your <span className="gradient-text">Result</span>
            </h2>
            <p className="text-gray-400 text-lg font-body mb-10">
              Search by your Registration ID or Team Name to instantly view your hackathon result.
            </p>
            <Link to="/results">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-12 py-5 rounded-xl text-lg font-display font-bold inline-flex items-center gap-3"
              >
                <FaTrophy />
                View All Results
                <FaArrowRight />
              </motion.button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
