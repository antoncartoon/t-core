
/// <reference types="vite/client" />

// Wallet provider declarations
interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    isMetaMask?: boolean;
    on: (event: string, callback: Function) => void;
    removeListener: (event: string, callback: Function) => void;
  };
  WalletConnect?: any;
}

declare global {
  interface Window {
    ethereum?: any;
    WalletConnect?: any;
  }
}

export {};
