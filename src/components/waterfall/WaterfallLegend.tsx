
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Droplet, Target } from 'lucide-react';

const WaterfallLegend = () => {
  const items = [
    {
      icon: Shield,
      label: 'Safe Tier (1-25)',
      description: 'Guaranteed 5.16% fixed yield',
      color: 'text-green-600'
    },
    {
      icon: Droplet,
      label: 'Conservative (26-50)',
      description: 'Fixed + small bonus (~8%)',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      label: 'Balanced (51-75)',
      description: 'Fixed + medium bonus (~17%)',
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Hero (76-100)',
      description: 'Fixed + large bonus (~75%)',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <item.icon className={`w-4 h-4 mt-1 ${item.color}`} />
          <div>
            <div className="font-medium text-sm">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaterfallLegend;
