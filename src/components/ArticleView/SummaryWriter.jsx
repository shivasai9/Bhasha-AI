import React from 'react';
import { useSummaryWriter } from '../../hooks/useSummaryWriter';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SummaryWriter() {
  const {
    summary,
    feedback,
    loading,
    showFeedback,
    handleSummaryChange,
    handleSubmit
  } = useSummaryWriter();

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Write Your Summary</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write your summary here..."
        />
        
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Submit for Feedback'}
        </button>
      </form>

      {showFeedback && (
        <div className="space-y-6">
          {/* Suggestions Section */}
          {feedback.errors.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Suggestions for Improvement</h3>
              <div className="space-y-4">
                {feedback.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 font-medium">Original:</p>
                      <p className="text-amber-700 mb-2">{error.original}</p>
                      <p className="text-amber-800 font-medium">Suggestion:</p>
                      <p className="text-amber-700">{error.correction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corrected Version Section */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Corrected Version</h3>
            </div>
            <p className="text-green-700 whitespace-pre-wrap">{feedback.corrected}</p>
          </div>
        </div>
      )}
    </div>
  );
}