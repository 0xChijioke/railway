// components/RecentActivity.tsx
"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useAccount, useChainId } from "wagmi";
import { useRecentTransfers } from "@/hooks/useRecentTransfers";
import { TOKEN_ADDRESSES, TOKEN_ICONS, NETWORK_META } from "@/config";
import Image from "next/image";
import { Address } from "./Address/Address";

interface RecentActivityProps {
  tokenAddress?: string;
  icon?: string;
}

export function RecentActivity({ tokenAddress, icon }: RecentActivityProps) {
  const { address } = useAccount();
  const chainId = useChainId();

  const chainTokens = TOKEN_ADDRESSES[chainId];
  const activeTokenAddress = tokenAddress || chainTokens?.usdc;
  const tokenIcon = icon || TOKEN_ICONS["usdc"];



  const { data: txs, isLoading } = useRecentTransfers(activeTokenAddress as `0x${string}`, address, 6);


  const network = NETWORK_META[chainId];

  return (
    <Accordion type="single" collapsible className="mt-6 w-full">
      <AccordionItem value="activity">
        <AccordionTrigger className="text-sm font-semibold">
          💸 Recent Activity {network?.name ?? "Unknown"}
        </AccordionTrigger>

        <AccordionContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          ) : !txs?.length ? (
            <p className="text-sm text-muted-foreground">No recent transactions found</p>
          ) : (
            <div className="space-y-2">
              {txs.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex justify-between items-center rounded-xl border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex w-full justify- items-center gap-3 min-w-0">
                    <Image
                      src={tokenIcon}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <div className="flex justify-center items-center gap-4">
                      <span className="font-medium text-xs uppercase text-muted-foreground">
                        {(tx.from === address ? "Sent" : "Received")}
                      </span>
                      <div className="text-[11px] space-x-2 text-muted-foreground truncate flex items-center gap-1">
                        <Address address={tx.from as `0x${string}`} onlyEnsOrAddress /> 
                        <span className="text-muted-foreground/70 text-xl">→</span>
                        <Address address={tx.to as `0x${string}`} onlyEnsOrAddress />
                      </div>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap text-xs font-semibold">
                    {tx.from === address ? (
                      <span className="text-red-500">- {tx.amount.toFixed(2)} USDC</span>
                    ) : (
                      <span className="text-green-500">+ {tx.amount.toFixed(2)} USDC</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
