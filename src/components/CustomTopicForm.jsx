import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLabels } from "../hooks/useLabels";

export default function CustomTopicForm({ onSubmit }) {
  const [topic, setTopic] = useState('');
  const labels = useLabels('CUSTOM_TOPIC_FORM_LABELS');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic);
      setTopic('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={labels.inputPlaceholder}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 
            focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-900"
          />
          <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={!topic.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors flex items-center font-medium 
          hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {labels.generateButton}
        </button>
      </div>
    </form>
  );
}