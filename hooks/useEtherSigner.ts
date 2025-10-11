import { BrowserProvider, JsonRpcSigner } from "ethers"
import { useMemo } from "react"
import { Account, Chain, Client, Transport } from "viem"
import { Config, useConnectorClient } from "wagmi"

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}



export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  if (!account || !chain || !transport) throw new Error("Invalid wallet client")

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)

  return signer
}
