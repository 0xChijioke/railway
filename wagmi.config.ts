import { http, createConfig } from 'wagmi'
import {
  Chain,
  mainnet,
  sepolia,
  hardhat,
  gnosis,
  polygon,
  optimism,
  baseSepolia
} from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import silk from './services/silk.connector'

const defaultChains: Chain[] = [sepolia, mainnet, gnosis, polygon, baseSepolia ]

if (process.env.NODE_ENV == 'development') {
  defaultChains.push(hardhat)
}

export const walletConnectConnector = walletConnect({
  projectId: 'b589b5f837abf3430f55ee8a0138f72a'
})

export const wagmiConfig = createConfig({
  chains: defaultChains as any as readonly [Chain, ...Chain[]],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [gnosis.id]: http(),
    [optimism.id]: http(),
    [baseSepolia.id]: http()
  },
  connectors: [
    silk({  useStaging: true }),
    injected(),
    walletConnectConnector,
  ]
})
