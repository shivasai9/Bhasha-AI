import React, { useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LANGUAGES } from '../../lib/constants';

export default function LanguageDropdown({ value, onChange, isOpen, setIsOpen, label }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.name.toLowerCase() === value.toLowerCase()) || LANGUAGES[0];
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <div className="flex items-center">
            <span className="text-xl mr-2">{currentLang.flag}</span>
            <span className="text-gray-900">{currentLang.name}</span>
          </div>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onChange(language.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 flex items-center hover:bg-gray-50 transition-colors ${
                  value.toLowerCase() === language.name.toLowerCase() ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                }`}
              >
                <span className="text-xl mr-2">{language.flag}</span>
                <span>{language.name}</span>
                {value.toLowerCase() === language.name.toLowerCase() && (
                  <Check className="w-4 h-4 ml-auto text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}