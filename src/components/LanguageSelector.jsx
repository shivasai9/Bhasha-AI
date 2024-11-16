import { Globe2, BookOpen, Sparkles } from "lucide-react";
import useLanguageSelector from "../hooks/uselanguageSelector";
import { LANGUAGES } from "../lib/constants";

export default function LanguageSelector() {
  const { handleLanguageSelect } = useLanguageSelector();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <Globe2 className="w-12 h-12 text-indigo-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-800">Basha AI</h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-gray-600">
                <BookOpen className="w-6 h-6" />
                <p className="text-lg">
                  Choose your preferred language to begin your learning journey
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.name)}
                    className="flex items-center justify-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">{lang.flag}</span>
                      <span className="text-lg font-medium text-gray-700">
                        {lang.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <p>Powered by Chrome Built-In AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
