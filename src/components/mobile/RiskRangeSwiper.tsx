
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TIER1_WIDTH } from '@/utils/riskRangeCalculations';
import { useIsMobile } from '@/hooks/use-mobile';

interface RiskRangeSwipeProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  className?: string;
}

/**
 * Mobile-friendly risk range selector with swipe gestures
 */
const RiskRangeSwiper: React.FC<RiskRangeSwipeProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentRange, setCurrentRange] = useState<[number, number]>(value);
  
  // Predefined risk ranges
  const presetRanges = [
    { name: 'Safe', range: [1, TIER1_WIDTH], color: 'bg-green-500/10 text-green-600' },
    { name: 'Low', range: [20, 40], color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Medium', range: [40, 70], color: 'bg-yellow-500/10 text-yellow-600' },
    { name: 'High', range: [70, 100], color: 'bg-red-500/10 text-red-600' },
    { name: 'Split', range: [1, 80], color: 'bg-purple-500/10 text-purple-600' },
  ];

  // Update current range when props change
  useEffect(() => {
    setCurrentRange(value);
  }, [value]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - startX;
    
    // Calculate new range based on swipe distance
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const sensitivity = 100 / (containerWidth / 2); // How much each pixel of swipe affects the range
    
    const rangeWidth = currentRange[1] - currentRange[0];
    
    if (Math.abs(deltaX) > 5) { // Only process significant movements
      const newStart = Math.max(1, Math.min(100 - rangeWidth, currentRange[0] + Math.round(deltaX * sensitivity)));
      const newEnd = newStart + rangeWidth;
      
      if (newEnd <= 100) {
        setCurrentRange([newStart, newEnd]);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      onChange(currentRange);
    }
  };

  // Shift range left/right with buttons
  const shiftRangeLeft = () => {
    const rangeWidth = currentRange[1] - currentRange[0];
    const newStart = Math.max(1, currentRange[0] - 5);
    const newEnd = newStart + rangeWidth;
    
    setCurrentRange([newStart, newEnd]);
    onChange([newStart, newEnd]);
  };

  const shiftRangeRight = () => {
    const rangeWidth = currentRange[1] - currentRange[0];
    const newStart = Math.min(100 - rangeWidth, currentRange[0] + 5);
    const newEnd = newStart + rangeWidth;
    
    setCurrentRange([newStart, newEnd]);
    onChange([newStart, newEnd]);
  };

  // Select preset range
  const selectPresetRange = (preset: { range: [number, number] }) => {
    setCurrentRange(preset.range);
    onChange(preset.range);
  };

  // Helper to determine the current range category
  const getCurrentRangeCategory = () => {
    const avgRisk = (currentRange[0] + currentRange[1]) / 2;
    
    if (currentRange[1] <= TIER1_WIDTH) return 'Safe';
    if (avgRisk <= 40) return 'Low';
    if (avgRisk <= 70) return 'Medium';
    if (avgRisk > 70 && currentRange[1] - currentRange[0] < 40) return 'High';
    return 'Split';
  };

  // Helper to get color for current range
  const getCurrentRangeColor = () => {
    const category = getCurrentRangeCategory();
    const preset = presetRanges.find(p => p.name === category);
    return preset?.color || 'bg-primary/10 text-primary';
  };

  if (!isMobile) {
    return null; // Only render on mobile devices
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Risk Range (Swipe to Move)</h3>
        <Badge variant="outline" className={getCurrentRangeColor()}>
          {getCurrentRangeCategory()}
        </Badge>
      </div>
      
      <div 
        ref={containerRef}
        className="relative h-16 bg-muted/30 rounded-lg overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Visual representation of range */}
        <div 
          className="absolute h-full bg-primary/20 flex items-center justify-center"
          style={{
            left: `${(currentRange[0] - 1) / 99 * 100}%`,
            width: `${(currentRange[1] - currentRange[0]) / 99 * 100}%`
          }}
        >
          <span className="text-xs font-medium text-primary">
            {currentRange[0]}-{currentRange[1]}
          </span>
        </div>
        
        {/* Tier markers */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/4 h-full border-r border-dashed border-muted-foreground/30">
            <div className="absolute top-1 left-1 text-[10px] text-muted-foreground">T1</div>
          </div>
          <div className="w-1/4 h-full border-r border-dashed border-muted-foreground/30">
            <div className="absolute top-1 left-[26%] text-[10px] text-muted-foreground">T2</div>
          </div>
          <div className="w-1/4 h-full border-r border-dashed border-muted-foreground/30">
            <div className="absolute top-1 left-[51%] text-[10px] text-muted-foreground">T3</div>
          </div>
          <div className="w-1/4 h-full">
            <div className="absolute top-1 left-[76%] text-[10px] text-muted-foreground">T4</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          className="p-2 rounded-full bg-muted/50 text-muted-foreground"
          onClick={shiftRangeLeft}
          disabled={currentRange[0] <= 1}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        
        <div className="text-sm font-medium">
          {currentRange[0]}-{currentRange[1]}
        </div>
        
        <button 
          className="p-2 rounded-full bg-muted/50 text-muted-foreground"
          onClick={shiftRangeRight}
          disabled={currentRange[1] >= 100}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {presetRanges.map((preset, index) => (
          <button
            key={index}
            className={`px-2 py-1 rounded-md text-xs ${preset.color}`}
            onClick={() => selectPresetRange({ range: preset.range as [number, number] })}
          >
            {preset.name} ({preset.range[0]}-{preset.range[1]})
          </button>
        ))}
      </div>
    </div>
  );
};

export default RiskRangeSwiper;
