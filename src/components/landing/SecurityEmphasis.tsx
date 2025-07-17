
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';

const SecurityEmphasis = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Diversified Asset Strategy",
      description: "We focus on solid assets like stablecoins and established pairs (ETH/USDC), avoiding volatile meme coins and speculative tokens.",
      highlights: ["Established asset pairs", "Risk-managed exposure", "Proven liquidity pools"]
    },
    {
      icon: Lock,
      title: "Battle-Tested Protocols",
      description: "We utilize the best DeFi protocols in each risk category, selecting only audited and proven platforms.",
      highlights: ["Audited protocols only", "Multi-signature security", "Best-in-class selection"]
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "Every allocation, every yield source, and every transaction is visible on-chain and in our dashboard.",
      highlights: ["Real-time tracking", "On-chain verification", "Open source code"]
    }
  ];

  const riskComparison = [
    { aspect: "Asset Type", traditional: "Stocks, Bonds, Crypto", tcore: "Stablecoins & Blue-chip pairs" },
    { aspect: "Volatility", traditional: "High (±20-50%)", tcore: "Managed (±0.1-5%)" },
    { aspect: "Principal Risk", traditional: "Significant", tcore: "Minimized" },
    { aspect: "Yield Source", traditional: "Speculation", tcore: "DeFi Optimization" }
  ];

  return (
    <section id="security" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">
            High Yields ≠ High Risk
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our high yields come from optimization and efficiency, not from taking on dangerous risks. 
            We focus on solid assets and proven protocols while earning optimized returns.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border bg-card/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Risk Comparison Table */}
        <Card className="border-border bg-card/50">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-medium text-center mb-6">
              T-Core vs Traditional High-Yield Investments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Aspect</th>
                    <th className="text-left py-3 px-4 font-medium text-red-600">Traditional</th>
                    <th className="text-left py-3 px-4 font-medium text-green-600">T-Core</th>
                  </tr>
                </thead>
                <tbody>
                  {riskComparison.map((row, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{row.aspect}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.traditional}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.tcore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SecurityEmphasis;
