
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';
import WaterfallChart from '../WaterfallChart';
import WaterfallLegend from './WaterfallLegend';
import { Separator } from '@/components/ui/separator';

const WaterfallDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          Waterfall Distribution Model
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-[16/9]">
          <WaterfallChart />
        </div>
        <Separator />
        <WaterfallLegend />
        
        {/* Mathematical Note */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Formula:</strong> Dist_i = surplus × (f(i)/∑f(j&gt;1)) × stake
            <br />
            Where f(i) = 1.03^(i - 25) for higher tiers, creating exponential bonus weighting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterfallDashboard;
