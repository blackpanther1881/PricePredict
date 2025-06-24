import type { AppProps } from 'next/app';
import '@mysten/dapp-kit/dist/index.css';
import Head from "next/head";
import {createNetworkConfig, lightTheme, SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import '../styles/globals.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
export const SupportedWallets = ["Suiet", "Slush", "Surf Wallet"];

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
  },
  mainnet: {
    url: getFullnodeUrl("mainnet"),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </Head>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
            autoConnect={true}
            theme={lightTheme}
            walletFilter={(wallet) => SupportedWallets.includes(wallet.name)}
        >
          <Component {...pageProps} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </>

}

export default MyApp;