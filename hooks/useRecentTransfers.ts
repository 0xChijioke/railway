import { useQuery } from "@tanstack/react-query"
import { usePublicClient, useChainId } from "wagmi"
import { erc20Abi, formatUnits } from "viem"

interface TransferEvent {
  hash: string
  from: string
  to: string
  amount: number
  timestamp?: number
}

export function useRecentTransfers(
  tokenAddress: `0x${string}`,
  userAddress?: `0x${string}`,
  decimals = 6
) {
  const client = usePublicClient()
  const chainId = useChainId()

  const query = useQuery({
    queryKey: ["recentTransfers", tokenAddress, userAddress, chainId],
    queryFn: async (): Promise<TransferEvent[]> => {
      if (!userAddress || !tokenAddress || !client) return []

      // Get latest block
      const latestBlock = await client.getBlockNumber()
      const fromBlock = latestBlock - BigInt(5000) // adjust range for performance
      const toBlock = latestBlock

      // Fetch Transfer events (ERC20)
      const logs = await client.getLogs({
        address: tokenAddress,
        event: {
          type: "event",
          name: "Transfer",
          inputs: [
            { name: "from", type: "address", indexed: true },
            { name: "to", type: "address", indexed: true },
            { name: "value", type: "uint256", indexed: false },
          ],
        },
        fromBlock,
        toBlock,
        strict: false,
      })

      const transfers: TransferEvent[] = logs
        .map((log) => {
          const { from, to, value } = log.args as any
          const relevant = from === userAddress || to === userAddress
          if (!relevant) return null

          return {
            hash: log.transactionHash,
            from,
            to,
            amount: Number(formatUnits(value, decimals)),
          }
        })
        .filter(Boolean) as TransferEvent[]

      return transfers.slice(-5).reverse() // latest 5
    },
    refetchInterval: 10000, // every 10s for live updates
    staleTime: 5000,
    enabled: !!userAddress && !!tokenAddress,
  })

  return query
}
