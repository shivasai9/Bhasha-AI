import React from 'react';
import { Book } from 'lucide-react';

export default function MeaningView({ definition }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Book className="w-4 h-4" />
        <span className="font-medium">Meaning</span>
      </div>
      <p className="text-gray-600 text-sm">{definition}</p>
    </div>
  );
}