import React from 'react';

const SkeletonCard = () => (
  <div className="glass rounded-2xl p-6">
    <div className="flex justify-between items-start">
      <div className="space-y-3 flex-1">
        <div className="skeleton h-6 w-48 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <div className="skeleton h-8 w-24 rounded-full" />
    </div>
    <div className="skeleton h-px w-full rounded mt-5" />
  </div>
);

const ResultsSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default ResultsSkeleton;
