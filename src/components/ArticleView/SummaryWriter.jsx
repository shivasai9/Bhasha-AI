import React from "react";
import { useSummaryWriter } from "../../hooks/useSummaryWriter";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useLabels } from "../../hooks/useLabels";

export default function SummaryWriter() {
  const labels = useLabels('SUMMARY_WRITER_LABELS');
  const {
    summary,
    feedback,
    loading,
    showFeedback,
    handleSummaryChange,
    handleSubmit,
    isEnglish,
  } = useSummaryWriter();

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {labels.title}
      </h2>

      {!isEnglish && (
        <div className={`bg-yellow-50 text-yellow-800 text-sm rounded-md p-3 mb-4 flex items-center`}>
          <Info className={`w-4 h-4 text-yellow-600 flex-shrink-0`} />
          <p className="ml-3">{labels.languageWarning.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          disabled={!isEnglish}
          className={`w-full h-40 p-4 border rounded-lg resize-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 
            ${!isEnglish ? "bg-gray-100 cursor-not-allowed" : ""}`}
          placeholder={isEnglish ? labels.textArea.placeholder.english : labels.textArea.placeholder.other}
        />

        <button
          type="submit"
          disabled={loading || !isEnglish}
          className={`mt-4 py-2 px-6 rounded-lg transition-colors ${
            !isEnglish
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400"
          }`}
        >
          {loading ? labels.submitButton.loading : labels.submitButton.default}
        </button>
      </form>

      {showFeedback && isEnglish && (
        <div className="space-y-6">
          {feedback.errors.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">
                {labels.feedback.suggestions.title}
              </h3>
              <div className="space-y-4">
                {feedback.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 font-medium">{labels.feedback.suggestions.originalLabel}</p>
                      <p className="text-amber-700 mb-2">{error.original}</p>
                      <p className="text-amber-800 font-medium">{labels.feedback.suggestions.suggestionLabel}</p>
                      <p className="text-amber-700">{error.correction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                {labels.feedback.corrected.title}
              </h3>
            </div>
            <p className="text-green-700 whitespace-pre-wrap">
              {feedback.corrected}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
