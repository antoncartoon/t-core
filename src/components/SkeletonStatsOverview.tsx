import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonStatsOverview = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border-border">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-16 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SkeletonStatsOverview;