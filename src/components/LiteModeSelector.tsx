import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LITE_TEMPLATES, LiteTemplate } from '@/types/tcore';
import { Shield, TrendingUp, Zap } from 'lucide-react';

interface LiteModeSelectorProps {
  selectedTemplate: LiteTemplate;
  onTemplateChange: (template: LiteTemplate) => void;
}

export const LiteModeSelector: React.FC<LiteModeSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const getTemplateIcon = (name: string) => {
    switch (name) {
      case 'Conservative': return Shield;
      case 'Balanced': return TrendingUp;
      case 'Aggressive': return Zap;
      default: return Shield;
    }
  };

  const getTemplateColor = (name: string) => {
    switch (name) {
      case 'Conservative': return 'text-green-500';
      case 'Balanced': return 'text-yellow-500';
      case 'Aggressive': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Choose from pre-configured risk templates designed for different investment strategies.
      </div>
      
      <div className="grid gap-3">
        {LITE_TEMPLATES.map((template) => {
          const Icon = getTemplateIcon(template.name);
          const isSelected = selectedTemplate.name === template.name;
          
          return (
            <Button
              key={template.name}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 justify-start ${isSelected ? '' : 'hover:bg-muted/50'}`}
              onClick={() => onTemplateChange(template)}
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={`h-5 w-5 mt-0.5 ${getTemplateColor(template.name)}`} />
                
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{template.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(template.expectedAPY * 100).toFixed(1)}% APY
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Levels {template.riskRange.start}-{template.riskRange.end}</span>
                    <span>{template.riskRange.end - template.riskRange.start + 1} risk levels</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {template.riskDescription}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {React.createElement(getTemplateIcon(selectedTemplate.name), {
                className: `h-4 w-4 ${getTemplateColor(selectedTemplate.name)}`
              })}
              {selectedTemplate.name} Strategy Selected
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Risk Range</p>
                <p className="font-medium">Levels {selectedTemplate.riskRange.start}-{selectedTemplate.riskRange.end}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expected APY</p>
                <p className="font-medium text-primary">{(selectedTemplate.expectedAPY * 100).toFixed(1)}%</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                <strong>Strategy:</strong> {selectedTemplate.riskDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};