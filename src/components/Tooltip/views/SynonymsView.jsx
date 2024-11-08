import React from 'react';
import { Hash } from 'lucide-react';

export default function SynonymsView({ synonyms }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Hash className="w-4 h-4" />
        <span className="font-medium">Synonyms</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {synonyms.map((synonym, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
          >
            {synonym}
          </span>
        ))}
      </div>
    </div>
  );
}