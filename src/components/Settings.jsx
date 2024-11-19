import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Header from './common/Header';
import LanguageDropdown from './common/LanguageDropdown';
import { LANGUAGES } from '../lib/constants';
import { saveInterfaceLanguage, saveLearningLanguage, getInterfaceLanguage, getLearningLanguage } from '../lib/languageStorage';

export default function Settings() {
  const findMatchingLanguageName = (storedName) => {
    const matchingLang = LANGUAGES.find(
      lang => lang.name.toLowerCase() === storedName.toLowerCase()
    );
    return matchingLang ? matchingLang.name : LANGUAGES[0].name;
  };

  const navigate = useNavigate();
  const [interfaceLanguage, setInterfaceLanguage] = useState(
    findMatchingLanguageName(getInterfaceLanguage())
  );
  const [learningLanguage, setLearningLanguage] = useState(
    findMatchingLanguageName(getLearningLanguage())
  );
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);

  const handleSave = () => {
    saveInterfaceLanguage(interfaceLanguage);
    saveLearningLanguage(learningLanguage);
    navigate('/articles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <LanguageDropdown
              value={interfaceLanguage}
              onChange={setInterfaceLanguage}
              isOpen={isInterfaceOpen}
              setIsOpen={setIsInterfaceOpen}
              label="Interface Language"
            />

            <LanguageDropdown
              value={learningLanguage}
              onChange={setLearningLanguage}
              isOpen={isLearningOpen}
              setIsOpen={setIsLearningOpen}
              label="Learning Language"
            />

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}