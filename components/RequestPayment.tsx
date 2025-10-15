"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, QrCode, Wallet, Check, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import QRCode from "react-qr-code"
import { AddressInput } from "./Input"
import { encodeRequest } from "@/lib/link"
import { verifyHumanity } from "@/lib/utils"

export function RequestPayment() {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("usdc")
  const [note, setNote] = useState("")
  const [link, setLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Default recipient = connected address
  useEffect(() => {
    if (address) setRecipient(address)
    else setRecipient("")
  }, [address])

  const handleGenerate = async () => {
    if (!address) {
        toast.error("Please connect your wallet first.")
        return
    }

    const isHuman = verifyHumanity(address);
    if (!isHuman) {
        toast.error("Human verification failed. Please verify your Passport.");
        return;
    }
    console.log("isHuman", isHuman)
    if (!recipient) {
        toast.error("Enter a recipient address.")
        return
    }
    if (!amount || Number(amount) <= 0) {
        toast.error("Enter a valid amount.")
        return
    }

    const payload = {
        to: recipient,
        amount: amount,
        token: currency,
        ...(note ? { note } : {}),
    }

    try {
        const encoded = await encodeRequest(payload)
        const url = `${window.location.origin}/?data=${encodeURIComponent(encoded)}`
        setLink(url)
        // setShowQR(true)
        toast.success("Payment request link generated.")
    } catch (err) {
        console.error(err)
        toast.error("Failed to create link.")
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard!")
  }

  return (
    <Card className="w-full lg:min-w-[500px] bg-neutral mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Request Payment
        </CardTitle>
        <CardDescription>
          Create and share a payment request link with anyone
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!address && (
          <Alert variant="destructive">
            <AlertDescription>Connect your wallet to create a payment request.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">

          <div className="flex flex-row gap-2">
            <div className="space-y-2 flex-1">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                min="0.001"
                placeholder="0.001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Token *</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Recipient address */}
          <div className="space-y-2 my-4">
            <Label htmlFor="recipient">Recipient *
              {!recipient && <Loader2 className="h-3 w-3 animate-spin" />}
            </Label>
            <AddressInput
            //   id="recipient"
            //   type="text"
              value={recipient}
              onChange={(e) => setRecipient(e)}
              placeholder="Enter recipient wallet address"
            />
            <p className="text-xs text-gray-500">
              Defaults to your connected wallet. You can change it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Coffee payment, freelance work..."
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!address}
          className="w-full"
          size="lg"
        >
          Generate Request Link
        </Button>

        {link && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/30 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="truncate">{link}</p>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-center">
              {showQR && (
                <div className="flex flex-col items-center gap-2">
                  <QRCode value={link} size={150} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQR(false)}
                  >
                    <QrCode className="h-4 w-4 mr-2" /> Hide QR
                  </Button>
                </div>
              )}
              {!showQR && link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQR(true)}
                >
                  <QrCode className="h-4 w-4 mr-2" /> Show QR
                </Button>
              )}
            </div>
          </div>
        )}

        {/* <div className="text-sm text-gray-600 space-y-2 p-4 rounded-lg">
          <p className="font-medium">How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Enter amount and token type</li>
            <li>Set who should receive it (defaults to you)</li>
            <li>Click “Generate” to get your payment link</li>
            <li>Share it — the sender will see a prefilled payment screen</li>
          </ul>
        </div> */}
      </CardContent>
    </Card>
  )
}