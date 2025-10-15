"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SendPayment } from "@/components/SendPayment";
import { SendCrossChainPayment } from "@/components/SendCrossChainPayment";
import { WalletBalance } from "@/components/WalletBalance";
import { decodeRequest } from "@/lib/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prefill } from "@/utils/types";
import { RecentActivity } from "./RecentActivity";

export default function PaymentContent() {
  const searchParams = useSearchParams();

  const [prefill, setPrefill] = useState<Prefill>({
    recipientAddress: searchParams.get("to") || "",
    amount: searchParams.get("amount") ? Number(searchParams.get("amount")) : 0,
    currency: searchParams.get("token") || "usdc",
    note: searchParams.get("note") || "",
  });

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) return;

    const decode = async () => {
      const decoded = await decodeRequest(decodeURIComponent(dataParam));
      if (!decoded.ok) {
        console.log("Invalid request link:", decoded.error);
        return;
      }

      const params = decoded.payload!;
      setPrefill((prev) => ({
        recipientAddress: params.get("to") || prev.recipientAddress,
        amount: params.get("amount")
          ? Number(params.get("amount"))
          : prev.amount,
        currency: params.get("token") || prev.currency,
        note: params.get("note") || prev.note,
      }));
    };

    decode();
  }, [searchParams]);

  return (
    <div className="w-full lg:max-w-2xl mt-4 lg:mt-0 max-h-screen m-auto p-4 lg:p-10">
      <WalletBalance className="pb-2 items-center flex justify-end" />

      <Tabs defaultValue="same-chain">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="same-chain">Send</TabsTrigger>
          <TabsTrigger value="cross-chain">Bridge</TabsTrigger>
        </TabsList>

        <TabsContent value="same-chain">
          <SendPayment prefill={prefill} />
        </TabsContent>

        <TabsContent value="cross-chain">
          <SendCrossChainPayment />
        </TabsContent>
      </Tabs>
      <RecentActivity />
    </div>
  );
}
