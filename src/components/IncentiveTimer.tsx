import React, { useEffect, useState } from 'react';

interface IncentiveTimerProps {
  className?: string;
  compact?: boolean;
}

const IncentiveTimer = ({ className, compact = false }: IncentiveTimerProps) => {
  // Sample data for incentive distribution
  const [timeRemaining, setTimeRemaining] = useState({
    days: 12,
    hours: 8,
    minutes: 0,
  });
  
  const dailyTDD = 50; // Sample daily TDD amount distributed
  
  // Update timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.hours === 0 && prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1 };
        }
        return prev;
      });
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  if (compact) {
    return (
      <div className={`flex flex-col ${className || ''}`}>
        <span className="font-bold text-purple-600">
          {timeRemaining.days}d {timeRemaining.hours}h
        </span>
        <span className="text-xs text-muted-foreground">
          {dailyTDD} TDD/day
        </span>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col ${className || ''}`}>
      <div className="font-bold text-xl text-purple-600">
        {timeRemaining.days}d {timeRemaining.hours}h remaining
      </div>
      <div className="text-sm text-muted-foreground">
        {dailyTDD} TDD distributed daily
      </div>
    </div>
  );
};

export default IncentiveTimer;