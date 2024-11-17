import React from 'react';
import MeaningView from './MeaningView';
import SynonymsView from './SynonymsView';
import AntonymsView from './AntonymsView';
import ExampleView from './ExampleView';
import TranslateView from './TranslateView';

export default function AllView({
  wordDetails,
  loading
}) {
  return (
    <div className="space-y-2">
      <div className="border-b">
        <MeaningView definition={wordDetails.meaning} />
      </div>
      {wordDetails.synonyms?.length > 0 && (
        <div className="border-b">
          <SynonymsView synonyms={wordDetails.synonyms} />
        </div>
      )}
      {wordDetails.antonyms?.length > 0 && (
        <div className="border-b">
          <AntonymsView antonyms={wordDetails.antonyms} />
        </div>
      )}
      {wordDetails.exampleSentence && (
        <div className="border-b">
          <ExampleView example={wordDetails.exampleSentence} />
        </div>
      )}
      <div>
        <TranslateView
          loading={loading}
          selectedText={wordDetails.word}
        />
      </div>
    </div>
  );
}