"use client"

import { useEffect, useState } from "react"
import { useAccount, useBalance, useBlockNumber } from "wagmi"
import Image from "next/image"


const TOKEN_ICONS: Record<string, string> = {
  eth: "/eth.png",
  usdc: "/usdc.png",
}

const USDC_CONTRACTS: Record<number, `0x${string}`> = {
  1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // mainnet
  10: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", // OP
  11155111: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // sepolia
  11155420: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7", // OPSepolia
}




export function WalletBalance({
    showLabel = false,
    size = "md",
    className = "",
}: {
    showLabel?: boolean
    size?: "sm" | "md" | "lg"
    className?: string
}) {
  const { address, chainId } = useAccount()
  const [usdcAddress, setUsdcAddress] = useState<`0x${string}` | undefined>()
  const { data: blockNumber } = useBlockNumber({ watch: true })


  useEffect(() => {
    if (chainId && USDC_CONTRACTS[chainId]) {
      setUsdcAddress(USDC_CONTRACTS[chainId])
    }
  }, [chainId])

  const { data: ethBalance, refetch: refetchEth } = useBalance({
    address,
  })

  const { data: usdcBalance, refetch: refetchUsdc } = useBalance({
    address,
    token: usdcAddress,
  })



useEffect(() => {
  if (blockNumber) {
    refetchEth()
    refetchUsdc()
  } 
}, [blockNumber, refetchEth, refetchUsdc])




  if (!address) return null
  
  const sizeClass =
  size === "sm"
      ? "h-4 w-4 text-xs"
      : size === "lg"
      ? "h-8 w-8 text-lg"
      : "h-6 w-6 text-base"

  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      key={blockNumber?.toString()}
    >
      {/* ETH */}
      <div className="flex items-center gap-2">
        <Image
          src={TOKEN_ICONS.eth}
          alt="ETH"
          width={24}
          height={24}
          className={sizeClass}
        />
        <span className="font-semibold">
          {Number(ethBalance?.formatted || 0).toFixed(4)}
        </span>
        {showLabel && <span className="text-gray-500 text-sm">ETH</span>}
      </div>

      {/* USDC */}
      {usdcBalance && (
        <div className="flex items-center gap-2">
          <Image
            src={TOKEN_ICONS.usdc}
            alt="USDC"
            width={24}
            height={24}
            className={sizeClass}
          />
          <span className="font-semibold">
            {Number(usdcBalance?.formatted || 0).toFixed(2)}
          </span>
          {showLabel && <span className="text-gray-500 text-sm">USDC</span>}
        </div>
      )}
    </div>
  )
}
