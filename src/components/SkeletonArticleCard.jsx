import React from 'react';
import PlaceholderImage from './PlaceholderImage';

export default function SkeletonArticleCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex h-[240px] animate-pulse relative">
      <div className="w-1/3">
        <PlaceholderImage />
      </div>
      <div className="w-2/3 p-6 flex flex-col">
        <div className="h-7 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="flex items-center gap-3 mt-auto">
          <div className="h-10 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}