import { useState, useEffect } from 'react';
import { getInterfaceLanguage } from '../lib/languageStorage';
import { translateText } from '../lib/translation.service';
import * as componentLabels from '../lib/componentLabels';

export function useLabels(componentName) {
  const [labels, setLabels] = useState(componentLabels[componentName] || {});
  const interfaceLanguage = getInterfaceLanguage();

  useEffect(() => {
    const translateLabels = async () => {
      if (interfaceLanguage.toLowerCase() === 'english') {
        setLabels(componentLabels[componentName]);
        return;
      }

      const translateValue = async (value) => {
        if (Array.isArray(value)) {
          return Promise.all(value.map(async (item) => {
            if (typeof item === 'object') {
              const translatedItem = {};
              for (const [key, val] of Object.entries(item)) {
                translatedItem[key] = await translateValue(val);
              }
              return translatedItem;
            }
            return typeof item === 'string' ? await translateText(item, 'english', interfaceLanguage) : item;
          }));
        }
        
        if (typeof value === 'object' && value !== null) {
          const translatedObj = {};
          for (const [key, val] of Object.entries(value)) {
            translatedObj[key] = await translateValue(val);
          }
          return translatedObj;
        }

        return typeof value === 'string' ? await translateText(value, 'english', interfaceLanguage) : value;
      };

      const translations = await translateValue(componentLabels[componentName]);
      setLabels(translations);
    };

    translateLabels();
  }, [componentName, interfaceLanguage]);

  return labels;
}