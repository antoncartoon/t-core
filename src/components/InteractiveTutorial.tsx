import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Target,
  DollarSign,
  Shield,
  TrendingUp,
  Brain,
  Layers,
  Eye,
  BarChart3
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ElementType;
  action?: string;
  highlight?: boolean;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to T-Core',
    description: 'Learn how to maximize your DeFi yields with T-Core\'s risk-optimized strategies.',
    target: 'hero',
    icon: Play,
    highlight: true
  },
  {
    id: 'risk-selection',
    title: 'Choose Your Risk Level',
    description: 'Select from 4 risk tiers: Conservative, Balanced, Aggressive, and T-Core HERO based on your comfort level. Pro users can create custom tiers.',
    target: 'risk-calculator',
    icon: Target,
    action: 'Try adjusting the risk slider'
  },
  {
    id: 'portfolio-setup',
    title: 'Build Your Portfolio',
    description: 'Deposit TDD tokens and create diversified positions across multiple risk tiers.',
    target: 'deposit-card',
    icon: DollarSign,
    action: 'Connect your wallet to start'
  },
  {
    id: 'liquidity-positions',
    title: 'Liquidity Positions',
    description: 'Create liquidity positions that represent your stake in specific risk ranges with instant unstaking capability.',
    target: 'staking-card',
    icon: Layers,
    action: 'Explore liquidity options'
  },
  {
    id: 'track-performance',
    title: 'Monitor Your Returns',
    description: 'Track your portfolio performance and optimize your strategy over time.',
    target: 'portfolio-stats',
    icon: TrendingUp,
    action: 'View your dashboard'
  },
  {
    id: 'ai-optimization',
    title: 'AI Portfolio Optimization',
    description: 'Use machine learning to automatically optimize your portfolio allocation and maximize returns.',
    target: 'ai-optimizer',
    icon: Brain,
    action: 'Try the AI optimizer'
  },
  {
    id: 'risk-diversification',
    title: 'Risk Diversification',
    description: 'Learn how to diversify across Conservative, Balanced, and T-Core HERO risk ranges for optimal yield.',
    target: 'copy-trading',
    icon: BarChart3,
    action: 'Explore risk distribution'
  },
  {
    id: 'protocol-transparency',
    title: 'Protocol Transparency',
    description: 'Monitor all protocol operations, collateral backing, and governance decisions in real-time on-chain.',
    target: 'security-dashboard',
    icon: Eye,
    action: 'Check transparency dashboard'
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Track and manage all your liquidity positions across different risk tiers from one unified view.',
    target: 'global-search',
    icon: Shield,
    action: 'Manage your positions'
  }
];

interface InteractiveTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
  isVisible: boolean;
}

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  onComplete,
  onSkip,
  isVisible
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
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

  const handleSkip = () => {
    onSkip();
  };

  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  const step = TUTORIAL_STEPS[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-2">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="p-6">
            {isCompleted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold">Tutorial Complete!</h3>
                <p className="text-muted-foreground">
                  You're ready to start building your optimized DeFi portfolio.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {step.action && (
                      <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                        <p className="text-sm font-medium text-accent-foreground">
                          💡 {step.action}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isCompleted && (
            <div className="p-6 border-t bg-muted/30">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip Tutorial
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                  >
                    <span>{currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
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

export default InteractiveTutorial;