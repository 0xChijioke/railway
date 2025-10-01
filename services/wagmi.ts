import { http, createConfig } from "wagmi";
import { sepolia, mainnet, hardhat, arbitrum, gnosis } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  ssr: true, 
  chains: [sepolia, mainnet, arbitrum, gnosis],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [gnosis.id]: http(),
  },
});

export function getConfig() {
  return config;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}