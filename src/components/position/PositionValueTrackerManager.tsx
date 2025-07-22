import React from 'react';
import { NFTPosition } from '@/types/tcore';
import PositionValueTracker from './PositionValueTracker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Props {
  positions: NFTPosition[];
}

const PositionValueTrackerManager = ({ positions }: Props) => {
  if (!positions.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No active positions found. Create a position to track value in real-time.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {positions.map((position) => (
        <PositionValueTracker
          key={position.tokenId}
          position={position}
        />
      ))}
    </div>
  );
};

export default PositionValueTrackerManager;