
import React from 'react';

export default function CustomTooltip({ text, visible }) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[2px]">
        <div className="border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}