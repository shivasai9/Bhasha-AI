import React, { useState } from 'react';
import { X, Gauge, Lightbulb } from 'lucide-react';
import { useLabels } from '../../hooks/useLabels';

export default function DifficultyLevelModal({ selectedDifficulty, onDifficultyChange, onClose }) {
  const labels = useLabels('ENHANCED_DIFFICULTY_MODAL_LABELS');
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
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            {labels.title}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {labels.presetDifficulties.map((diff) => (
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
            <span className="font-medium">{labels.suggestedPresetsTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {labels.presets.map((preset) => (
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
              {labels.customLevelLabel}
            </label>
            <input
              type="text"
              value={customLevel}
              onChange={(e) => setCustomLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={labels.customLevelPlaceholder}
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
              ? labels.customLevelButton.withCustom
              : selectedPreset 
                ? labels.customLevelButton.withPreset(
                    labels.presetDifficulties.find(d => d.id === selectedPreset)?.label
                  )
                : labels.customLevelButton.default}
          </button>
        </form>
      </div>
    </div>
  );
}