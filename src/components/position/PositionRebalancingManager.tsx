import React from 'react';
import { NFTPosition } from '@/types/tcore';
import PositionRebalancingAdvisor from './PositionRebalancingAdvisor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Props {
  positions: NFTPosition[];
  onPositionRebalance: (tokenId: string, newRange: { start: number; end: number }) => void;
}

const PositionRebalancingManager = ({ positions, onPositionRebalance }: Props) => {
  if (!positions.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No active positions found. Create a position to access rebalancing recommendations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {positions.map((position) => (
        <PositionRebalancingAdvisor
          key={position.tokenId}
          position={position}
          onRebalanceAccept={(newRange) => onPositionRebalance(position.tokenId, newRange)}
        />
      ))}
    </div>
  );
};

export default PositionRebalancingManager;