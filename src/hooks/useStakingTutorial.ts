
import { useState, useEffect } from 'react';

interface StakingTutorialState {
  isCompleted: boolean;
  isVisible: boolean;
  hasSeenBefore: boolean;
}

export const useStakingTutorial = () => {
  const [tutorialState, setTutorialState] = useState<StakingTutorialState>({
    isCompleted: false,
    isVisible: false,
    hasSeenBefore: false
  });

  useEffect(() => {
    // Check if user has seen staking tutorial before
    const hasSeenTutorial = localStorage.getItem('t-core-staking-tutorial-completed');
    const hasSeenBefore = localStorage.getItem('t-core-staking-tutorial-seen');
    
    setTutorialState({
      isCompleted: hasSeenTutorial === 'true',
      isVisible: false, // Don't auto-show, only on demand
      hasSeenBefore: hasSeenBefore === 'true'
    });
  }, []);

  const startTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isVisible: true,
      hasSeenBefore: true
    }));
    localStorage.setItem('t-core-staking-tutorial-seen', 'true');
  };

  const completeTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isCompleted: true,
      isVisible: false
    }));
    localStorage.setItem('t-core-staking-tutorial-completed', 'true');
  };

  const skipTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isVisible: false
    }));
    localStorage.setItem('t-core-staking-tutorial-seen', 'true');
  };

  const resetTutorial = () => {
    localStorage.removeItem('t-core-staking-tutorial-completed');
    localStorage.removeItem('t-core-staking-tutorial-seen');
    setTutorialState({
      isCompleted: false,
      isVisible: false,
      hasSeenBefore: false
    });
  };

  return {
    ...tutorialState,
    startTutorial,
    completeTutorial,
    skipTutorial,
    resetTutorial
  };
};
