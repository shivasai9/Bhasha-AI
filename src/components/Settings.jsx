import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Layout, BookOpenCheck } from 'lucide-react';
import Header from './common/Header';
import LanguageDropdown from './common/LanguageDropdown';
import { LANGUAGES } from '../lib/constants';
import { saveInterfaceLanguage, saveLearningLanguage, getInterfaceLanguage, getLearningLanguage } from '../lib/languageStorage';
import { useLabels } from '../hooks/useLabels';

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
  const labels = useLabels('SETTINGS_LABELS');

  const handleSave = () => {
    saveInterfaceLanguage(interfaceLanguage);
    saveLearningLanguage(learningLanguage);
    navigate('/articles');
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/articles');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {labels.backButton}
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8">{labels.pageTitle}</h1>
          
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-4 text-gray-600">
                <Layout className="w-6 h-6 text-indigo-600" />
                <p className="text-xl font-medium">{labels.interfaceSection?.title}</p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                {labels.interfaceSection?.description}
              </p>
            </div>
            <LanguageDropdown
              value={interfaceLanguage}
              onChange={setInterfaceLanguage}
              isOpen={isInterfaceOpen}
              setIsOpen={setIsInterfaceOpen}
              label="interfaceLanguage"
            />

            <div className="space-y-2 mb-4 mt-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <BookOpenCheck className="w-6 h-6 text-indigo-600" />
                <p className="text-xl font-medium">{labels.learningSection?.title}</p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                {labels.learningSection?.description}
              </p>
            </div>
            <LanguageDropdown
              value={learningLanguage}
              onChange={setLearningLanguage}
              isOpen={isLearningOpen}
              setIsOpen={setIsLearningOpen}
              label="learningLanguage"
            />

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              {labels.saveButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}