
import React from 'react';

export default function QuizSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-2 bg-gray-200" />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded-full" />
        </div>

        <div className="h-8 w-3/4 bg-gray-200 rounded mb-8" />

        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4].map((_, index) => (
            <div
              key={index}
              className="w-full p-4 rounded-lg border-2 border-gray-200"
            >
              <div className="h-5 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}