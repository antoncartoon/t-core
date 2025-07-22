
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
  TrendingDown, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  Play
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  example?: string;
  formula?: string;
  visual?: React.ReactNode;
}

const STAKING_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ТЗ Compliant Staking',
    description: 'Learn how to maximize yields with waterfall distribution, bonus optimization, and stress testing using exact mathematical formulas.',
    icon: Play,
    example: 'Start with $10,000 TDD and see potential returns across different risk tiers.'
  },
  {
    id: 'risk-architecture',
    title: 'Risk Architecture: 100 Buckets',
    description: 'Risk curve is divided into 100 buckets (0-99) across 4 main tiers: Safe (0-9), Conservative (10-29), Balanced (30-59), Hero (60-99).',
    icon: BarChart3,
    formula: 'APY(r) = APY_safe + (APY_protocol - APY_safe) × r^1.5',
    example: 'Bucket 50 → r = 50/99 = 0.505 → APY = 5.16% + (10% - 5.16%) × 0.505^1.5 = 8.6%'
  },
  {
    id: 'waterfall-distribution',
    title: 'Waterfall Distribution System',
    description: 'Yields flow from Safe → Conservative → Balanced → Hero. Losses flow in reverse: Hero absorbs first, then Balanced, etc.',
    icon: TrendingDown,
    example: 'If protocol earns 10% APY: Safe gets guaranteed 5.16%, Conservative 7%, Balanced 9%, Hero gets residual.'
  },
  {
    id: 'bonus-yield',
    title: 'Bonus Yield Mechanism',
    description: '50% of performance fee incentivizes underweight tiers. Target distribution: Safe 10%, Conservative 20%, Balanced 30%, Hero 40%.',
    icon: Zap,
    formula: 'bonus_i = (fee_pool × (target_weight_i - current_weight_i)) / sum_positive_deltas',
    example: 'If Hero tier is underweight by 10%, it gets bonus APY boost: +1.2% Bonus Yield'
  },
  {
    id: 'stress-testing',
    title: 'Stress Loss Scenarios',
    description: 'See exact loss percentages for -1%, -5%, -10% TVL scenarios. Losses distributed from highest buckets down.',
    icon: Shield,
    formula: 'Loss = min(residual_loss, user_position) / user_position',
    example: 'Hero tier (bucket 75) in -5% TVL scenario: 3.2% position loss, Safe tier (bucket 5): 0% loss'
  },
  {
    id: 'interface-tour',
    title: 'Interactive Interface Features',
    description: 'Auto-calculation, quick strategies, visual heatmaps, and real-time APY predictions as you adjust parameters.',
    icon: Calculator,
    example: 'Try Quick Strategies: Safe Haven (6.0% APY), Conservative (8.5%), Balanced Growth (14.2%), Hero Maximizer (35%+)'
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
                    You now understand T-Core's advanced staking system with waterfall distribution, bonus optimization, and stress testing.
                  </p>
                </div>
                <NavLink to="/staking">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Calculator className="w-4 h-4 mr-2" />
                    Launch Staking Interface
                  </Button>
                </NavLink>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    {step.formula && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Formula:</div>
                        <code className="text-sm font-mono text-blue-700 dark:text-blue-300">{step.formula}</code>
                      </div>
                    )}
                    
                    {step.example && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Example:</div>
                        <p className="text-sm text-green-700 dark:text-green-300">{step.example}</p>
                      </div>
                    )}
                  </div>
                </div>
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
                  <ArrowLeft className="w-4 h-4" />
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
