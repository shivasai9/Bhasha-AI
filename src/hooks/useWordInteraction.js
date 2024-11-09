import { useState, useEffect } from 'react';
import { saveWord, getWordById } from '../lib/dbUtils';

export function useWordInteraction(word) {
  const [wordDetails, setWordDetails] = useState(null);
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfWordIsSaved = async () => {
      try {
        const savedWord = await getWordById(word);
        setIsSaved(!!savedWord);
      } catch (error) {
        console.error('Error checking if word is saved:', error);
      }
    };

    if (word) {
      checkIfWordIsSaved();
    }
  }, [word]);

  useEffect(() => {
    const fetchWordDetails = async () => {
      if (!word) return;
      
      setLoading(true);
      try {
        // Simulated API call - replace with actual Chrome AI API implementation
        const details = {
          definition: `Sample definition for "${word}"`,
          synonyms: ['similar1', 'similar2', 'similar3'],
          antonyms: ['opposite1', 'opposite2', 'opposite3'],
          example: `Here's a sample sentence using "${word}" in context.`
        };
        
        setWordDetails(details);
      } catch (error) {
        console.error('Error fetching word details:', error);
        setWordDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWordDetails();
  }, [word]);

  const handleTranslate = async (targetLang) => {
    if (!word) return;

    setLoading(true);
    try {
      // Simulated translation - replace with actual Chrome AI Translation API
      const translatedText = `Translated "${word}" to ${targetLang}: [translation]`;
      setTranslation(translatedText);
    } catch (error) {
      console.error('Error translating word:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!word || !wordDetails) return;

    try {
      await saveWord({
        word,
        ...wordDetails,
        savedAt: new Date().toISOString()
      });
      setIsSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving word:', error);
      return false;
    }
  };

  return {
    wordDetails,
    translation,
    loading,
    targetLanguage,
    setTargetLanguage,
    handleTranslate,
    handleSaveWord,
    isSaved
  };
}