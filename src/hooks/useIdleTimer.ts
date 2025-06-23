import { useState, useEffect } from 'react';

export const useIdleTimer = (idleTime: number = 3000) => {
  const [isIdle, setIsIdle] = useState(false);
  
  useEffect(() => {
    let timeoutId: number;
    
    const handleActivity = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), idleTime);
    };
    
    // Track various user activities
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel'
    ];
    
    // Initial timeout
    timeoutId = setTimeout(() => setIsIdle(true), idleTime);
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [idleTime]);
  
  return isIdle;
}; 