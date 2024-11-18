import { useEffect, useState } from 'react';

export function useTooltip(position, tooltipRef, triggerRef, triggerElBoundingClientRect) {
  const [tooltipStyle, setTooltipStyle] = useState({});

  const updatePosition = () => {
    if (!tooltipRef.current || !triggerElBoundingClientRect) return;
    
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let left = triggerElBoundingClientRect.left - tooltipRect.width - 10;
    
    if (left < 20) {
      left = triggerElBoundingClientRect.right + 10;
      if (left + tooltipRect.width > windowWidth - 20) {
        left = triggerElBoundingClientRect.left + (triggerElBoundingClientRect.width / 2) - (tooltipRect.width / 2);
      }
    }

    left = Math.max(20, Math.min(left, windowWidth - tooltipRect.width - 20));

    let top = triggerElBoundingClientRect.bottom + window.scrollY + 5;
    
    const bottomOverflow = (top + tooltipRect.height) - (window.scrollY + windowHeight);
    console.log('bottomOverflow', bottomOverflow);
    if (bottomOverflow > 0) {
      top -= bottomOverflow;
      
      console.log('top', top, triggerElBoundingClientRect.top);
      if (top < triggerElBoundingClientRect.top + 80) {
        top = triggerElBoundingClientRect.top - tooltipRect.height - 5;
      }
      
      top = Math.max(window.scrollY + 20, top);
    }

    const style = {
      position: 'fixed',
      top: top - window.scrollY,
      left: left,
      maxHeight: windowHeight - 40,
      overflowY: 'auto'
    };

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