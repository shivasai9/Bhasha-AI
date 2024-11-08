import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AntonymsView({ antonyms }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <ArrowRight className="w-4 h-4" />
        <span className="font-medium">Antonyms</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {antonyms.map((antonym, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
          >
            {antonym}
          </span>
        ))}
      </div>
    </div>
  );
}