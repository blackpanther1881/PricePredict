import { getFullnodeUrl } from "@mysten/sui/client";

export const SUI_NETWORKS = {
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    name: 'Mainnet',
  },
  testnet: {
    url: getFullnodeUrl('testnet'),
    name: 'Testnet',
  },
} as const;

export const DEFAULT_NETWORK = 'testnet';

export const SUPPORTED_WALLETS = ['OKX Wallet', 'Sui Wallet'] as const;

export const SUI_CONFIG = {
  networks: SUI_NETWORKS,
  defaultNetwork: DEFAULT_NETWORK,
  supportedWallets: SUPPORTED_WALLETS,
} as const; 