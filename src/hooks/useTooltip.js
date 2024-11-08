import { useEffect, useState } from 'react';

export function useTooltip(position, tooltipRef, triggerRef) {
  const [tooltipStyle, setTooltipStyle] = useState({});

  useEffect(() => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const updatePosition = () => {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      if (!tooltip || !trigger) return;

      const tooltipRect = tooltip.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate position relative to the trigger element
      let style = {
        position: 'fixed',
        top: triggerRect.bottom, // Align with text baseline
        left: triggerRect.left - tooltipRect.width - 10, // 10px gap from the word
      };

      // Adjust position if tooltip would go off screen
      if (style.left < 20) {
        style.left = triggerRect.right + 10;
      }

      if (style.top < 20) {
        style.top = triggerRect.top + 10;
      }

      if (style.top + tooltipRect.height > windowHeight - 20) {
        style.top = windowHeight - tooltipRect.height - 20;
      }

      if (style.left + tooltipRect.width > windowWidth - 20) {
        style.left = windowWidth - tooltipRect.width - 20;
      }

      setTooltipStyle(style);
    };

    // Initial position
    updatePosition();

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [position, tooltipRef, triggerRef]);

  return { tooltipStyle };
}