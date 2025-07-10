
import React, { useState } from 'react';
import { Wallet, Send, Download, ArrowUpDown, Copy, Trophy, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import WalletFunding from './WalletFunding';

interface WalletDropdownProps {
  walletAddress: string;
}

const WalletDropdown = ({ walletAddress }: WalletDropdownProps) => {
  const { toast } = useToast();
  const { balances, stakingPositions, getTotalStakedValue } = useWallet();
  const [fundingDialogOpen, setFundingDialogOpen] = useState(false);

  const activePositions = stakingPositions.filter(p => p.status === 'active');
  const totalStakedValue = getTotalStakedValue();
  const totalBalance = balances.reduce((sum, asset) => sum + asset.usdValue, 0) + totalStakedValue;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 bg-muted px-3 py-2 rounded hover:bg-muted/80">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm hidden sm:inline">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-background border border-border shadow-lg" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Wallet Assets</span>
            <Button variant="ghost" size="sm" onClick={copyAddress}>
              <Copy className="w-3 h-3" />
            </Button>
          </DropdownMenuLabel>
          
          <div className="px-2 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFundingDialogOpen(true)}
                className="h-6 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Funds
              </Button>
            </div>
            <p className="text-xl font-bold">${totalBalance.toLocaleString()}</p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {balances.map((asset) => (
              <div key={asset.symbol} className="px-2 py-3 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{asset.symbol}</p>
                    <p className="text-sm text-muted-foreground">{asset.balance.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${asset.usdValue.toLocaleString()}</p>
                    {asset.change && (
                      <p className={`text-xs ${asset.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* NFT Staking Positions Section */}
            {activePositions.length > 0 && (
              <>
                <div className="px-2 py-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-purple-600" />
                      <p className="font-medium">NFT Staking Positions</p>
                    </div>
                    <Badge variant="secondary">{activePositions.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Total Value: ${totalStakedValue.toLocaleString()}
                  </p>
                  
                  <div className="space-y-2">
                    {activePositions.slice(0, 3).map((position) => (
                      <div key={position.id} className="bg-muted/30 rounded-lg p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium">#{position.id.slice(-6)}</p>
                            <div className="flex items-center space-x-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  position.riskCategory === 'Conservative' ? 'text-green-600 border-green-600' :
                                  position.riskCategory === 'Moderate' ? 'text-yellow-600 border-yellow-600' :
                                  'text-red-600 border-red-600'
                                }`}
                              >
                                {position.riskCategory}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${position.currentValue.toFixed(0)}</p>
                            <p className="text-xs text-green-600">+${position.earnedAmount.toFixed(0)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {activePositions.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{activePositions.length - 3} more positions
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <DropdownMenuSeparator />
          
          <div className="p-2 grid grid-cols-3 gap-2">
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className="flex flex-col space-y-1 h-auto py-2">
                <Send className="w-4 h-4" />
                <span className="text-xs">Send</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className="flex flex-col space-y-1 h-auto py-2">
                <Download className="w-4 h-4" />
                <span className="text-xs">Receive</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" className="flex flex-col space-y-1 h-auto py-2">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-xs">Swap</span>
              </Button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={fundingDialogOpen} onOpenChange={setFundingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
          </DialogHeader>
          <WalletFunding onClose={() => setFundingDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletDropdown;
