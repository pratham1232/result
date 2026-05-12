import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRedo, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ResultCard from '../components/results/ResultCard';
import ResultsSkeleton from '../components/ui/ResultsSkeleton';
import { resultsAPI } from '../services/api';

const FILTERS = ['All', 'Selected', 'Rejected', 'Pending', 'Shortlisted'];

const EmptyState = ({ query }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-24"
  >
    <div className="text-8xl mb-6">🔍</div>
    <h3 className="font-display font-bold text-white text-2xl mb-3">No Results Found</h3>
    <p className="text-gray-400 font-body max-w-sm mx-auto">
      {query ? `No teams match "${query}". Try searching with a different Registration ID or name.` : 'No results have been published yet.'}
    </p>
  </motion.div>
);

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch results
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resultsAPI.getAll({
        search: debouncedSearch,
        status: filter !== 'All' ? filter : undefined,
        page,
        limit: 12,
      });
      setResults(res.data.results);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // stats calculation moved or removed if not needed in render


  return (
    <div className="min-h-screen bg-bgi-darker pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-bgi-primary/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-bgi-primary/30 bg-bgi-primary/5 text-bgi-primary text-sm font-mono mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-bgi-primary animate-pulse" />
            Results are Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-7xl text-white mb-6"
          >
            HACK<span className="gradient-text">ATHON</span>
            <br />
            <span className="text-4xl md:text-5xl text-gray-300 font-bold">RESULTS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-lg font-body mb-10"
          >
            Search your team by ID or name to view your hackathon result
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-bgi-primary" size={18} />
              <input
                type="text"
                placeholder="Search by Registration ID or Team Name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-14 pr-14 py-5 rounded-2xl bg-bgi-card border border-bgi-border text-white placeholder-gray-500 font-body text-base input-glow transition-all focus:border-bgi-primary"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-display font-semibold tracking-wide transition-all ${
                  filter === f
                    ? 'bg-bgi-primary text-bgi-darker shadow-lg shadow-bgi-primary/30'
                    : 'glass text-gray-400 hover:text-white border border-bgi-border hover:border-bgi-primary/50'
                }`}
              >
                {f}
                {f === 'All' && pagination.total ? ` (${pagination.total})` : ''}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={fetchResults}
              className="glass px-4 py-2 rounded-xl text-gray-400 hover:text-bgi-primary border border-bgi-border hover:border-bgi-primary/50 transition-all flex items-center gap-2 text-sm"
            >
              <FaRedo size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </motion.button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <ResultsSkeleton count={12} />
        ) : results.length === 0 ? (
          <EmptyState query={debouncedSearch} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${debouncedSearch}-${filter}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {results.map((result, i) => (
                  <ResultCard key={result._id} result={result} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="glass px-5 py-2 rounded-xl text-sm font-display font-semibold text-gray-400 hover:text-white border border-bgi-border disabled:opacity-40 transition-all"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-display font-bold transition-all ${
                          page === p
                            ? 'bg-bgi-primary text-bgi-darker'
                            : 'glass text-gray-400 hover:text-white border border-bgi-border'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="glass px-5 py-2 rounded-xl text-sm font-display font-semibold text-gray-400 hover:text-white border border-bgi-border disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
