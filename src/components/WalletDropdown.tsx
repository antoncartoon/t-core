
import React from 'react';
import { Wallet, Send, Download, ArrowUpDown, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletDropdownProps {
  walletAddress: string;
}

const WalletDropdown = ({ walletAddress }: WalletDropdownProps) => {
  const { toast } = useToast();

  const assets = [
    { symbol: 'USDT', balance: '5,248.50', usdValue: '5,248.50' },
    { symbol: 'USDC', balance: '3,156.25', usdValue: '3,156.25' },
    { symbol: 'tkchUSD', balance: '1,250.00', usdValue: '1,250.00' },
    { symbol: 'sttkchUSD', balance: '8,900.25', usdValue: '9,345.75' },
  ];

  const totalBalance = assets.reduce((sum, asset) => sum + parseFloat(asset.usdValue.replace(',', '')), 0);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 bg-muted px-3 py-2 rounded hover:bg-muted/80">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
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
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <p className="text-xl font-bold">${totalBalance.toLocaleString()}</p>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {assets.map((asset) => (
            <div key={asset.symbol} className="px-2 py-3 hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  <p className="text-sm text-muted-foreground">{asset.balance}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${asset.usdValue}</p>
                  {asset.symbol === 'sttkchUSD' && (
                    <p className="text-xs text-green-600">+{((parseFloat(asset.usdValue.replace(',', '')) / parseFloat(asset.balance.replace(',', '')) - 1) * 100).toFixed(1)}%</p>
                  )}
                </div>
              </div>
            </div>
          ))}
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
  );
};

export default WalletDropdown;
