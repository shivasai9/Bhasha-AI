import { useState, useEffect } from "react";
import { getInterfaceLanguage } from "../lib/languageStorage";
import { translateText } from "../lib/translation.service";
import * as componentLabels from "../lib/componentLabels";

const exclusionKeys = ["id", "className"];

export function useLabels(componentName) {
  const [labels, setLabels] = useState(componentName ? componentLabels[componentName] : componentLabels);
  const interfaceLanguage = getInterfaceLanguage();

  useEffect(() => {
    const translateLabels = async () => {
      if (interfaceLanguage.toLowerCase() === "english") {
        setLabels(componentName ? componentLabels[componentName] : componentLabels);
        return;
      }

      const translateValue = async (value, key = "") => {
        if (Array.isArray(value)) {
          return Promise.all(
            value.map(async (item) => {
              if (typeof item === "object") {
                const translatedItem = {};
                for (const [key, val] of Object.entries(item)) {
                  translatedItem[key] = 
                    exclusionKeys.includes(key) ? val : await translateValue(val, key);
                }
                return translatedItem;
              }
              return typeof item === "string"
                ? await translateText(item, "english", interfaceLanguage)
                : item;
            })
          );
        }

        if (typeof value === "object" && value !== null) {
          const translatedObj = {};
          for (const [key, val] of Object.entries(value)) {
            translatedObj[key] = 
              exclusionKeys.includes(key) ? val : await translateValue(val, key);
          }
          return translatedObj;
        }

        return typeof value === "string"
          ? await translateText(value, "english", interfaceLanguage)
          : value;
      };

      const translations = await translateValue(componentLabels[componentName]);
      setLabels(translations);
    };

    translateLabels();
  }, [componentName, interfaceLanguage]);

  return labels;
}
