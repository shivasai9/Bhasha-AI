import React, { useState, useEffect } from 'react';
import { Gauge, BookOpen, GripHorizontal, Minimize2, Maximize2, X } from 'lucide-react';

export default function DraggableToolbar({ 
  onSummaryClick, 
  onDifficultyClick, 
  showSummary, 
  difficultyLabel,
  buttonTheme 
}) {
  const [position, setPosition] = useState({ x: 200, y: 230 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);

  const handleHeaderClick = (e) => {
    if (isMinimized && !isDragging) {
      setIsMinimized(false);
    }
  };

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.grip-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.stopPropagation();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate3d(0, 0, 0)',
        maxWidth: 'min(250px, calc(100vw - 40px))' // Add max width
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <div 
          className="flex items-center px-3 py-2 border-b border-gray-200/50 cursor-pointer"
          onClick={handleHeaderClick}
          onMouseDown={handleMouseDown}
        >
          <span className="grip-handle shrink-0 cursor-grab hover:cursor-grab">
            <GripHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            Article Controls
          </span>
          <div className="ml-auto pl-2 shrink-0">
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <button
                onClick={handleMinimizeClick}
                className="hover:bg-gray-100/80 rounded-full p-1 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        {!isMinimized && (
          <div className="p-2 space-y-2">
            <button
              onClick={onSummaryClick}
              className="w-full px-4 py-2 text-sm flex items-start gap-3 rounded-lg hover:bg-blue-50/50 transition-all group"
            >
              <span className="p-1.5 mt-0.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="font-medium text-gray-700 truncate">
                  {showSummary ? 'Full Article' : 'Summary'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {showSummary ? 'View complete content' : 'Get quick overview'}
                </div>
              </div>
            </button>
            
            <div className="h-px bg-gray-100 my-2" />
            
            <button
              onClick={onDifficultyClick}
              className="w-full px-4 py-2 text-sm flex items-start gap-3 rounded-lg hover:bg-blue-50/50 transition-all group"
            >
              <span className="p-1.5 mt-0.5 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors shrink-0">
                <Gauge className="w-4 h-4 text-blue-600" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="font-medium text-gray-700">
                  Difficulty Level
                </div>
                <div className={`inline-flex mt-1 px-2 py-0.5 text-xs rounded-full border ${buttonTheme}`}>
                  {difficultyLabel}
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  Click to change level
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}