import { useState, useEffect } from 'react';

export function useDifficulties() {
  const [difficulties, setDifficulties] = useState([]);

  useEffect(() => {
    const savedDifficulties = localStorage.getItem('difficulties');
    if (savedDifficulties) {
      setDifficulties(JSON.parse(savedDifficulties));
    }
  }, []);

  const addDifficulty = (newDifficulty) => {
    const updatedDifficulties = [...difficulties, {
      id: newDifficulty.label.toLowerCase().replace(/\s+/g, '-'),
      ...newDifficulty,
      custom: true
    }];
    setDifficulties(updatedDifficulties);
    localStorage.setItem('difficulties', JSON.stringify(updatedDifficulties));
  };

  return {
    difficulties,
    addDifficulty
  };
}