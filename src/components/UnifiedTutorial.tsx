
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
  BarChart3,
  Zap,
  BookOpen
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ElementType;
  action?: string;
  highlight?: boolean;
  category: 'overview' | 'staking' | 'both';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to T-Core',
    description: 'Learn how to maximize your DeFi yields with T-Core\'s risk-optimized strategies.',
    target: 'hero',
    icon: Play,
    highlight: true,
    category: 'both'
  },
  {
    id: 'risk-selection',
    title: 'Choose Your Risk Level',
    description: 'Select from 4 risk tiers: Safe (6%), Conservative (9%), Balanced (16%), or T-Core HERO (35% max). Use precision buckets for advanced control.',
    target: 'risk-calculator',
    icon: Target,
    action: 'Try adjusting the risk slider',
    category: 'both'
  },
  {
    id: 'staking-basics',
    title: 'Staking Fundamentals',
    description: 'Deposit TDD tokens and create positions in specific risk ranges. Each position represents your stake with mathematical precision.',
    target: 'deposit-card',
    icon: DollarSign,
    action: 'Connect your wallet to start',
    category: 'staking'
  },
  {
    id: 'precision-ranges',
    title: 'Precision Risk Ranges',
    description: 'Choose exact bucket ranges (0-99) for precise risk-reward optimization. Higher buckets = higher yields + higher subordination.',
    target: 'staking-card',
    icon: Layers,
    action: 'Explore range selection',
    category: 'staking'
  },
  {
    id: 'waterfall-mechanics',
    title: 'Waterfall Distribution',
    description: 'Understand how yields flow: safe tiers get guaranteed returns first, then bonus yields cascade to higher risk tiers.',
    target: 'waterfall-chart',
    icon: TrendingUp,
    action: 'View waterfall simulation',
    category: 'overview'
  },
  {
    id: 'performance-tracking',
    title: 'Track Performance',
    description: 'Monitor your positions, yields, and risk metrics in real-time. See how your strategy performs over time.',
    target: 'portfolio-stats',
    icon: BarChart3,
    action: 'View your dashboard',
    category: 'both'
  },
  {
    id: 'yield-optimization',
    title: 'Yield Optimization',
    description: 'Use AI tools and analytics to optimize your portfolio allocation and maximize returns while managing risk.',
    target: 'ai-optimizer',
    icon: Brain,
    action: 'Try the AI optimizer',
    category: 'overview'
  },
  {
    id: 'transparency',
    title: 'Protocol Transparency',
    description: 'Monitor all protocol operations, fee allocation (20% performance fee), and collateral backing in real-time on-chain.',
    target: 'security-dashboard',
    icon: Eye,
    action: 'Check transparency dashboard',
    category: 'overview'
  }
];

type TutorialMode = 'selection' | 'complete' | 'staking';

interface UnifiedTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
  isVisible: boolean;
  initialMode?: TutorialMode;
}

const UnifiedTutorial: React.FC<UnifiedTutorialProps> = ({
  onComplete,
  onSkip,
  isVisible,
  initialMode = 'selection'
}) => {
  const [mode, setMode] = useState<TutorialMode>(initialMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const filteredSteps = mode === 'complete' 
    ? TUTORIAL_STEPS 
    : TUTORIAL_STEPS.filter(step => step.category === 'both' || step.category === 'staking');

  const handleModeSelect = (selectedMode: TutorialMode) => {
    setMode(selectedMode);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (mode !== 'selection') {
      setMode('selection');
      setCurrentStep(0);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const progress = mode === 'selection' ? 0 : ((currentStep + 1) / filteredSteps.length) * 100;
  const step = filteredSteps[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-2">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              {mode !== 'selection' && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Step {currentStep + 1} of {filteredSteps.length}</span>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8 p-0 ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {mode !== 'selection' && <Progress value={progress} className="h-2" />}
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === 'selection' ? (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Choose Your Learning Path</h3>
                  <p className="text-muted-foreground">
                    Select the tutorial that best fits your needs
                  </p>
                </div>

                <div className="space-y-3">
                  <Card 
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50"
                    onClick={() => handleModeSelect('staking')}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Quick Staking Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          Fast-track to staking with essential steps only (~3 min)
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-2 hover:border-primary/50"
                    onClick={() => handleModeSelect('complete')}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Complete Overview</h4>
                        <p className="text-sm text-muted-foreground">
                          Full protocol walkthrough with advanced features (~5 min)
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : isCompleted ? (
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
          {mode !== 'selection' && !isCompleted && (
            <div className="p-6 border-t bg-muted/30">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 0 ? 'Back to Options' : 'Previous'}</span>
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
                    <span>{currentStep === filteredSteps.length - 1 ? 'Finish' : 'Next'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {mode === 'selection' && (
            <div className="p-6 border-t bg-muted/30">
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Skip Tutorial
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedTutorial;
