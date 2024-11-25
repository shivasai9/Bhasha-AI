import React, { useState } from 'react';
import { ArrowLeft, Book, Heart, MessageCircle, Theater, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConversationView from './ConversationView';
import Header from '../common/Header';
import { saveConversationDetails } from '../../lib/languageStorage';
import { CONVERSATION_TYPES } from '../../lib/constants';

export default function ConversationInterface() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const conversationOptions = {
    grammar: [
      'Present Tense Practice',
      'Past Tense Practice',
      'Conditional Sentences',
      'Prepositions Usage'
    ],
    personal: [
      'Talk about your day',
      'Weekend plans',
      'Hobbies & Interests',
      'Future goals'
    ],
    topics: [
      'Living in a past era',
      'Million-dollar project',
      'Dream vacation',
      'Future technology'
    ],
    scenarios: [
      'Ordering at a café',
      'Job interview practice',
      'Airport check-in',
      'Making reservations'
    ]
  };

  const buttonThemes = {
    grammar: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    personal: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    topics: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    scenarios: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
  };

  const dropdownThemes = {
    grammar: "bg-emerald-50 divide-emerald-200",
    personal: "bg-amber-50 divide-amber-200",
    topics: "bg-rose-50 divide-rose-200",
    scenarios: "bg-indigo-50 divide-indigo-200"
  };

  const handleOptionSelect = (option, type) => {
    saveConversationDetails(type, option);
    setSelectedOption(option);
    setActiveDropdown(null);
  };

  const handleOpenEnded = () => {
    saveConversationDetails(CONVERSATION_TYPES.OPEN_ENDED, "Open Conversation");
    setSelectedOption("Open Conversation");
  };

  if (selectedOption) {
    return <ConversationView topic={selectedOption} onClose={() => setSelectedOption(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/learning-mode-selector')}
            className="flex items-center gap-2 mb-4 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Choose a Conversation Type
              </h1>
              
              <button 
                onClick={handleOpenEnded}
                className="w-full bg-indigo-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-all mb-8"
              >
                Open-ended conversation
              </button>

              <div className="relative flex items-center justify-center mb-8">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-4 text-gray-500 absolute">or</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'grammar', icon: Book, label: 'Grammar lesson' },
                  { id: 'personal', icon: Heart, label: 'Something personal!' },
                  { id: 'topics', icon: MessageCircle, label: 'Discuss a topic' },
                  { id: 'scenarios', icon: Theater, label: 'Do a scenario' }
                ].map((button) => (
                  <div key={button.id} className="relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === button.id ? null : button.id)}
                      className={`w-full p-4 rounded-lg border border-white/10 transition-all flex flex-col items-center gap-2 group backdrop-blur-sm ${buttonThemes[button.id]}`}
                    >
                      <button.icon className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-all" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800">{button.label}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-all ${activeDropdown === button.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeDropdown === button.id && (
                      <div className={`absolute top-full left-0 right-0 mt-2 ${dropdownThemes[button.id]} backdrop-blur-md rounded-lg border border-gray-200 z-10 shadow-xl divide-y`}>
                        {conversationOptions[button.id].map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(option, CONVERSATION_TYPES[button.id.toUpperCase()])}
                            className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:${buttonThemes[button.id]} first:rounded-t-lg last:rounded-b-lg transition-colors`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}