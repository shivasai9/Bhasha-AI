import React from 'react';
import { FileText } from 'lucide-react';

export default function ExampleView({ example }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <FileText className="w-4 h-4" />
        <span className="font-medium">Example</span>
      </div>
      <p className="text-gray-600 text-sm italic">"{example}"</p>
    </div>
  );
}