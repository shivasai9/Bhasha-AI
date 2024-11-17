import { useState, useEffect } from 'react';
import { saveWord, getWordInfoByWord } from '../lib/dbUtils';
import { generateAndSaveWordInfo } from '../lib/wordInfoGenerator';
import { useParams } from 'react-router-dom';

export function useWordInteraction(word) {
  const [wordDetails, setWordDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { id: articleId } = useParams();

  useEffect(() => {
    const fetchWordDetails = async () => {
      if (!word) return;
      try {
        setLoading(true);
        let wordInfo = await getWordInfoByWord(word) || {};
        const { isSaved = false } = wordInfo || {};
        if(!(wordInfo && Object.keys(wordInfo).length > 0)) {
          wordInfo = await generateAndSaveWordInfo(word, articleId);
        }
        
        setIsSaved(isSaved);
        setWordDetails(wordInfo);
      } catch (error) {
        console.error('Error fetching word details:', error);
        setWordDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWordDetails();
  }, [word]);


  const handleSaveWord = async () => {
    if (!word || !wordDetails) return;

    try {
      await saveWord({
        word,
        ...wordDetails,
        isSaved: !isSaved,
        updatedAt: Date.now(),
      });
      setIsSaved((prev) => !prev);
      return true;
    } catch (error) {
      console.error('Error saving word:', error);
      return false;
    }
  };

  return {
    wordDetails,
    loading,
    handleSaveWord,
    isSaved
  };
}