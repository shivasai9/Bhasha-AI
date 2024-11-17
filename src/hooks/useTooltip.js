import { useEffect, useState } from 'react';

export function useTooltip(position, tooltipRef, triggerRef, triggerElBoundingClientRect) {
  const [tooltipStyle, setTooltipStyle] = useState({});

  const updatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;
    
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let style = {
      position: 'fixed',
      top: triggerElBoundingClientRect.bottom + window.scrollY,
      left: triggerElBoundingClientRect.left + window.scrollX - tooltipRect.width - 10,
    };

    // Check if tooltip overflows bottom of screen
    const tooltipBottom = style.top + tooltipRect.height;
    const overflowAmount = tooltipBottom - (windowHeight - 20);

    if (overflowAmount > 0) {
      // Move tooltip up by the overflow amount
      style.top -= overflowAmount;
      
      // If moving up would push it too high, position at top with padding
      if (style.top < 20) {
        style.top = 20;
      }
    }

    // Adjust horizontal position if needed
    if (style.left < 20) {
      style.left = triggerElBoundingClientRect.right + 10;
    }
    if (style.left + tooltipRect.width > windowWidth - 20) {
      style.left = windowWidth - tooltipRect.width - 20;
    }

    setTooltipStyle(style);
  };

  useEffect(() => {
    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [position, tooltipRef, triggerRef, triggerElBoundingClientRect]);

  return { tooltipStyle, updatePosition };
}