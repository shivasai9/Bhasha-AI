import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CustomTooltip({ text, visible, containerRef }) {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (visible && containerRef?.current) {
      const updatePosition = () => {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          left: rect.left + rect.width / 2,
          top: rect.top
        });
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [visible, containerRef]);

  if (!visible) return null;

  return createPortal(
    <div 
      className="fixed pointer-events-none"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translateX(-50%) translateY(calc(-100% - 10px))',
        zIndex: 99999
      }}
    >
      <div className="px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[2px]">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>,
    document.body
  );
}