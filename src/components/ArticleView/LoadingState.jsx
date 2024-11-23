
import React from 'react';

export default function LoadingState({ labels }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">{labels.loading.title}</h2>
      <p className="text-gray-500">{labels.loading.description}</p>
      <div className="space-y-6 w-[57%]">
        <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full animate-pulse w-5/6"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-full animate-pulse w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded-full animate-pulse w-4/5"></div>
        </div>
      </div>
    </div>
  );
}