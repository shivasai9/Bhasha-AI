import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';

const suggestionPresets = [
  { label: 'Creative Writing', description: 'Focus on imaginative expression and storytelling' },
  { label: 'For Children Below 5', description: 'Simple vocabulary and basic concepts' },
  { label: 'Technical', description: 'Advanced terminology and complex concepts' },
  { label: 'Conversational', description: 'Focus on daily dialogue and common phrases' }
];

export default function DifficultyModal({ onClose, onSubmit }) {
  const [customLevel, setCustomLevel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customLevel.trim()) {
      onSubmit({
        id: customLevel.toLowerCase().replace(/\s+/g, '-'),
        label: customLevel
      });
    }
  };

  const handlePresetClick = (preset) => {
    setCustomLevel(preset.label);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Custom Difficulty Level</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-3">
            <Lightbulb className="w-5 h-5" />
            <span className="text-sm font-medium">Suggested Presets</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestionPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="p-3 text-left border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-sm font-medium">{preset.label}</div>
                <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Level Name
            </label>
            <input
              type="text"
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your custom level..."
            />
          </div>
          <button
            type="submit"
            disabled={!customLevel.trim()}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              customLevel.trim()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
}