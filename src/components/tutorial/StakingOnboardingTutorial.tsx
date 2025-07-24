
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NavLink } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  Target, 
  Coins, 
  BarChart3,
  CheckCircle,
  Play
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  example?: string;
}

const STAKING_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to T-Core Staking',
    description: 'Earn yields on your TDD tokens with T-Core\'s risk-optimized staking system. Choose your risk level and start earning immediately.',
    icon: Play,
    example: 'Start with $1,000 TDD and see potential returns across different risk levels.'
  },
  {
    id: 'risk-selection',
    title: 'Choose Your Risk Level',
    description: 'Select from 4 simple tiers: Safe (5.16% APY), Conservative (8% APY), Balanced (12% APY), or Hero (25%+ APY). Higher risk means higher potential returns.',
    icon: Target,
    example: 'New users often start with Safe or Conservative tiers to get familiar with the system.'
  },
  {
    id: 'staking-process',
    title: 'Simple Staking Process',
    description: 'Just three easy steps: Enter your amount → Select your risk tier → Click "Stake". Your position becomes an NFT that you can manage anytime.',
    icon: Coins,
    example: 'Staking $5,000 in Balanced tier takes less than 30 seconds and starts earning immediately.'
  },
  {
    id: 'manage-positions',
    title: 'Manage Your Positions',
    description: 'View your earnings in real-time, unstake anytime with no penalties, and track all your NFT positions from the portfolio dashboard.',
    icon: BarChart3,
    example: 'Check your yields daily, unstake partially, or move between risk tiers as your strategy evolves.'
  }
];

interface StakingOnboardingTutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const StakingOnboardingTutorial: React.FC<StakingOnboardingTutorialProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < STAKING_TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = ((currentStep + 1) / STAKING_TUTORIAL_STEPS.length) * 100;
  const step = STAKING_TUTORIAL_STEPS[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-primary/20">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-purple/5">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="flex items-center space-x-1 bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                <span>Step {currentStep + 1} of {STAKING_TUTORIAL_STEPS.length}</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip Tutorial
              </Button>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Content */}
          <div className="p-8">
            {isCompleted ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Ready to Start Staking!</h3>
                  <p className="text-muted-foreground">
                    You're all set to start earning yields with T-Core staking. For detailed formulas and technical information, check out our FAQ and Transparency sections.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <NavLink to="/staking">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Calculator className="w-4 h-4 mr-2" />
                      Start Staking
                    </Button>
                  </NavLink>
                  <NavLink to="/faq">
                    <Button variant="outline" size="lg">
                      Learn More (FAQ)
                    </Button>
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                      {step.description}
                    </p>
                    
                    {step.example && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">💡 Tip:</div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{step.example}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick info for technical users */}
                {currentStep === STAKING_TUTORIAL_STEPS.length - 1 && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                    <p className="text-sm text-muted-foreground text-center">
                      Want to dive deeper into waterfall distribution, bonus yield mechanics, and mathematical formulas? 
                      Visit our <strong>FAQ</strong> and <strong>Transparency</strong> sections after completing this tutorial.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isCompleted && (
            <div className="p-6 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="flex space-x-3">
                  <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
                    Skip
                  </Button>
                  <Button onClick={handleNext} className="flex items-center space-x-2 bg-primary hover:bg-primary/90">
                    <span>{currentStep === STAKING_TUTORIAL_STEPS.length - 1 ? 'Start Staking' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StakingOnboardingTutorial;
