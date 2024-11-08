import React from 'react';
import MeaningView from './MeaningView';
import SynonymsView from './SynonymsView';
import AntonymsView from './AntonymsView';
import ExampleView from './ExampleView';
import TranslateView from './TranslateView';

export default function AllView({
  wordDetails,
  targetLanguage,
  onLanguageChange,
  translation,
  onTranslate,
  loading
}) {
  return (
    <div className="space-y-2">
      <div className="border-b pb-2">
        <MeaningView definition={wordDetails.definition} />
      </div>
      {wordDetails.synonyms?.length > 0 && (
        <div className="border-b pb-2">
          <SynonymsView synonyms={wordDetails.synonyms} />
        </div>
      )}
      {wordDetails.antonyms?.length > 0 && (
        <div className="border-b pb-2">
          <AntonymsView antonyms={wordDetails.antonyms} />
        </div>
      )}
      {wordDetails.example && (
        <div className="border-b pb-2">
          <ExampleView example={wordDetails.example} />
        </div>
      )}
      <div>
        <TranslateView
          targetLanguage={targetLanguage}
          onLanguageChange={onLanguageChange}
          translation={translation}
          onTranslate={onTranslate}
          loading={loading}
        />
      </div>
    </div>
  );
}