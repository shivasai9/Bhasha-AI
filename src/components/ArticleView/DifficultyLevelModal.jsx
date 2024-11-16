import React, { useState } from 'react';
import { X, Gauge, Lightbulb } from 'lucide-react';

const presetDifficulties = [
  { 
    id: 'easy', 
    label: 'Easy',
    description: 'Simple vocabulary and basic sentence structures',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
  },
  { 
    id: 'medium', 
    label: 'Medium',
    description: 'Moderate complexity with varied vocabulary',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  },
  { 
    id: 'hard', 
    label: 'Hard',
    description: 'Complex sentences and advanced vocabulary',
    className: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
  }
];

const customPresets = [
  { label: 'Creative Writing', description: 'Focus on imaginative expression and storytelling' },
  { label: 'For Children Below 5', description: 'Simple vocabulary and basic concepts' },
  { label: 'Technical', description: 'Advanced terminology and complex concepts' },
  { label: 'Conversational', description: 'Focus on daily dialogue and common phrases' }
];

export default function DifficultyLevelModal({ selectedDifficulty, onDifficultyChange, onClose }) {
  const [customLevel, setCustomLevel] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(selectedDifficulty);

  const handleCustomPresetClick = (preset) => {
    setCustomLevel(preset.label);
    setSelectedPreset('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customLevel.trim()) {
      onDifficultyChange(customLevel.toLowerCase().replace(/\s+/g, '-'));
      onClose();
    } else if (selectedPreset) {
      onDifficultyChange(selectedPreset);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}  // Add click handler to backdrop
    >
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            Select Difficulty Level
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {presetDifficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => {
                setSelectedPreset(diff.id);
                setCustomLevel('');
              }}
              className={`p-4 rounded-lg text-left transition-all ${diff.className} ${
                selectedPreset === diff.id ? 'ring-2 ring-offset-2 ring-gray-900/10' : ''
              }`}
            >
              <div className="font-medium mb-1">{diff.label}</div>
              <div className="text-sm opacity-75">{diff.description}</div>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <Lightbulb className="w-5 h-5" />
            <span className="font-medium">Custom Presets</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {customPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleCustomPresetClick(preset)}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your custom level..."
            />
          </div>
          <button
            type="submit"
            disabled={!customLevel.trim() && !selectedPreset}
            className={`w-full py-2.5 px-4 rounded-lg transition-colors ${
              customLevel.trim() || selectedPreset
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {customLevel.trim() 
              ? 'Apply Custom Level'
              : selectedPreset 
                ? `Apply ${presetDifficulties.find(d => d.id === selectedPreset)?.label} Level`
                : 'Select a Difficulty Level'}
          </button>
        </form>
      </div>
    </div>
  );
}