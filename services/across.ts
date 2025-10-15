import { createAcrossClient } from "@across-protocol/app-sdk";
import { raailConfig, getRpcUrl } from "@/config";

export const acrossClient = createAcrossClient({
  useTestnet: true,
  chains: raailConfig.targetNetworks,
  rpcUrls: Object.fromEntries(
    raailConfig.targetNetworks.map((c) => [c.id, getRpcUrl(c.id)])
  ),
});
