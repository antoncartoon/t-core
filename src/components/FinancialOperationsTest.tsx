import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFinancialOperations } from '@/hooks/useFinancialOperations';
import { useWalletManager } from '@/hooks/useWalletManager';
import { useAuth } from '@/contexts/AuthContext';
import { TestTube, Wallet, TrendingUp, ArrowRightLeft } from 'lucide-react';

const FinancialOperationsTest = () => {
  const [testAmount, setTestAmount] = useState('100');
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();
  const { mintTDD, redeemTDD, createStakingPosition, isLoading } = useFinancialOperations();
  const { wallets, getPrimaryWallet } = useWalletManager();
  const { user, walletAddress } = useAuth();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testMintOperation = async () => {
    try {
      addResult('🔄 Testing TDD minting...');
      const result = await mintTDD(parseFloat(testAmount), 'USDC');
      addResult(`✅ Mint successful: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Mint failed: ${error.message}`);
    }
  };

  const testRedeemOperation = async () => {
    try {
      addResult('🔄 Testing TDD redemption...');
      const result = await redeemTDD(parseFloat(testAmount), 'TDD');
      addResult(`✅ Redeem successful: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Redeem failed: ${error.message}`);
    }
  };

  const testStakingOperation = async () => {
    try {
      addResult('🔄 Testing staking position creation...');
      const result = await createStakingPosition(parseFloat(testAmount), 0.12, 5);
      addResult(`✅ Staking successful: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Staking failed: ${error.message}`);
    }
  };

  const runFullTest = async () => {
    setTestResults([]);
    addResult('🚀 Starting comprehensive financial operations test...');
    
    // Test wallet connection
    addResult(`👤 User: ${user?.id || 'Not authenticated'}`);
    addResult(`💳 Wallet: ${walletAddress || 'No wallet connected'}`);
    addResult(`🔗 Primary Wallet: ${getPrimaryWallet()?.address || 'None'}`);
    addResult(`📊 Total Wallets: ${wallets.length}`);
    
    // Test operations
    await testMintOperation();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    await testRedeemOperation();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    await testStakingOperation();
    
    addResult('🏁 Test sequence completed!');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Financial Operations Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Authentication Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Authentication</div>
            <Badge variant={user ? "default" : "destructive"}>
              {user ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Wallet</div>
            <Badge variant={walletAddress ? "default" : "destructive"}>
              {walletAddress ? `${walletAddress.slice(0, 8)}...` : "None"}
            </Badge>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">DB Wallets</div>
            <Badge variant="outline">
              {wallets.length} registered
            </Badge>
          </div>
        </div>

        {/* Test Amount Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Test Amount</label>
          <Input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(e.target.value)}
            placeholder="Enter test amount"
          />
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testMintOperation}
            disabled={isLoading}
          >
            <Wallet className="h-4 w-4 mr-1" />
            Mint
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testRedeemOperation}
            disabled={isLoading}
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Redeem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testStakingOperation}
            disabled={isLoading}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Stake
          </Button>
          <Button
            onClick={runFullTest}
            disabled={isLoading}
            className="bg-primary"
          >
            {isLoading ? "Running..." : "Full Test"}
          </Button>
        </div>

        {/* Test Results */}
        <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-xs max-h-80 overflow-y-auto">
          <div className="text-white mb-2">🧪 Test Results:</div>
          {testResults.length === 0 ? (
            <div className="text-slate-400">Click "Full Test" to run comprehensive tests...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOperationsTest;