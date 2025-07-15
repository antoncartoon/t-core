import { useState, useEffect } from 'react';

interface TutorialState {
  isCompleted: boolean;
  isVisible: boolean;
  hasSeenBefore: boolean;
}

export const useTutorial = () => {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isCompleted: false,
    isVisible: false,
    hasSeenBefore: false
  });

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('t-core-tutorial-completed');
    const hasSeenBefore = localStorage.getItem('t-core-tutorial-seen');
    
    setTutorialState({
      isCompleted: hasSeenTutorial === 'true',
      isVisible: hasSeenTutorial !== 'true' && hasSeenBefore !== 'true',
      hasSeenBefore: hasSeenBefore === 'true'
    });
  }, []);

  const startTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isVisible: true,
      hasSeenBefore: true
    }));
    localStorage.setItem('t-core-tutorial-seen', 'true');
  };

  const completeTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isCompleted: true,
      isVisible: false
    }));
    localStorage.setItem('t-core-tutorial-completed', 'true');
  };

  const skipTutorial = () => {
    setTutorialState(prev => ({
      ...prev,
      isVisible: false
    }));
    localStorage.setItem('t-core-tutorial-seen', 'true');
  };

  const resetTutorial = () => {
    localStorage.removeItem('t-core-tutorial-completed');
    localStorage.removeItem('t-core-tutorial-seen');
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