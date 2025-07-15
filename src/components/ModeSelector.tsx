import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ModeSelectorProps {
  isProMode: boolean;
  onModeChange: (isProMode: boolean) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ isProMode, onModeChange }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <div className="flex items-center space-x-2">
        <Label htmlFor="mode-switch" className="text-sm font-medium">
          Simple
        </Label>
        <Switch
          id="mode-switch"
          checked={isProMode}
          onCheckedChange={onModeChange}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="mode-switch" className="text-sm font-medium">
          Pro
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                <span className="font-medium">Simple:</span> Core features and clear interface<br />
                <span className="font-medium">Pro:</span> Advanced analytics and detailed controls
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ModeSelector;