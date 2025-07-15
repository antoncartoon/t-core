import React, { useState, useEffect } from 'react';

interface MobileGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

const MobileGestureHandler: React.FC<MobileGestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    // Store touch start position for swipe detection
    (e.currentTarget as any).touchStartX = touch.clientX;
    (e.currentTarget as any).touchStartY = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - (e.currentTarget as any).touchStartX;
    const deltaY = touch.clientY - (e.currentTarget as any).touchStartY;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > minSwipeDistance && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < -minSwipeDistance && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > minSwipeDistance && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < -minSwipeDistance && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`${className} select-none`}
    >
      {children}
    </div>
  );
};

export default MobileGestureHandler;