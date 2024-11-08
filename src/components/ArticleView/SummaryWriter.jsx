import React from 'react';
import { useSummaryWriter } from '../../hooks/useSummaryWriter';
import { Check, AlertCircle } from 'lucide-react';

export default function SummaryWriter() {
  const {
    summary,
    feedback,
    loading,
    showFeedback,
    handleSummaryChange,
    handleSubmit,
    closeFeedback
  } = useSummaryWriter();

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Write Your Summary</h2>
      
      <form onSubmit={handleSubmit}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Summary Feedback</h3>
              <button onClick={closeFeedback} className="text-gray-500 hover:text-gray-700">
                <Check className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {feedback.errors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Original:</p>
                    <p className="text-gray-600">{error.original}</p>
                    <p className="font-medium mt-2">Suggestion:</p>
                    <p className="text-gray-600">{error.correction}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Corrected Version</h4>
                <p className="text-gray-700">{feedback.corrected}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}