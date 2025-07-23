import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ValidationSuite from '@/components/ValidationSuite';
import ValidationTesting from '@/components/ValidationTesting';
import QuickValidationTest from '@/components/QuickValidationTest';

const Validation = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">T-Core Formula Validation</h1>
        <p className="text-muted-foreground">
          Comprehensive testing suite for T-Core mathematical formulas and calculations.
        </p>
      </div>

      {/* New comprehensive validation suite */}
      <ValidationSuite />
      
      {/* Existing validation components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickValidationTest />
        <Card>
          <CardHeader>
            <CardTitle>Extended Validation Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <ValidationTesting />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Validation;