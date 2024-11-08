import { useEffect, useState } from 'react';

export function useTooltip(position, tooltipRef) {
  const [tooltipStyle, setTooltipStyle] = useState({});

  useEffect(() => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate position to always show above and to the left of the word
    let style = {
      top: Math.max(8, position.y - tooltipRect.height - 8),
      left: Math.max(8, position.x - tooltipRect.width)
    };

    // If tooltip would go off-screen, adjust position
    if (style.top < 8) {
      style.top = position.y + 8; // Show below if not enough space above
    }
    if (style.left + tooltipRect.width > windowWidth - 8) {
      style.left = windowWidth - tooltipRect.width - 8;
    }

    setTooltipStyle(style);
  }, [position]);

  return { tooltipStyle };
}