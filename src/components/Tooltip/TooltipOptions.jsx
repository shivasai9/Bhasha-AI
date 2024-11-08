import React from 'react';
import { Book, Languages, Hash, ArrowRight, List, FileText } from 'lucide-react';

const options = [
  { id: 'meaning', label: 'Meaning', icon: Book },
  { id: 'synonyms', label: 'Synonyms', icon: Hash },
  { id: 'antonyms', label: 'Antonyms', icon: ArrowRight },
  { id: 'example', label: 'Example', icon: FileText },
  { id: 'translate', label: 'Translate', icon: Languages },
  { id: 'all', label: 'Show All', icon: List }
];

export default function TooltipOptions({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
          >
            <Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}