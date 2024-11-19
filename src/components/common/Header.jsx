import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Settings, BookmarkIcon, FileText } from 'lucide-react';

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: BookmarkIcon, label: 'Saved Words', href: '/saved-words' },
    { icon: FileText, label: 'Saved Articles', href: '/saved-articles' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="sticky top-0 z-50 px-4 py-4 pb-0 bg-gray-50">
      <header className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-lg">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-semibold text-white tracking-wide">
                BhashaAI
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/articles"
                className="text-white/90 hover:text-white transition-colors px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-md"
              >
                Articles
              </Link>
              
              {/* User Profile Button with Dropdown */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors hover:scale-105 active:scale-95"
                >
                  <User className="w-5 h-5 text-white" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 animate-in fade-in slide-in-from-top-5 duration-200">
                    {menuItems.map((item, index) => (
                      <React.Fragment key={item.label}>
                        {item.href ? (
                          <Link
                            to={item.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Link>
                        ) : (
                          <button
                            onClick={item.onClick}
                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                          >
                            <item.icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </button>
                        )}
                        {index < menuItems.length - 1 && (
                          <div className="border-b border-gray-100" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}