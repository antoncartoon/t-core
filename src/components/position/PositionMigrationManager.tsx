
import React from 'react';
import { NFTPosition } from '@/types/tcore';
import PositionMigrationTool from './PositionMigrationTool';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Props {
  positions: NFTPosition[];
  onPositionMigrate: (tokenId: string, newRange: { start: number; end: number }) => void;
}

const PositionMigrationManager = ({ positions, onPositionMigrate }: Props) => {
  if (!positions.length) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No active positions found. Create a position to enable migration options.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {positions.map((position) => (
        <PositionMigrationTool
          key={position.tokenId}
          position={position}
          onMigrate={(newRange) => onPositionMigrate(position.tokenId, newRange)}
        />
      ))}
    </div>
  );
};

export default PositionMigrationManager;
