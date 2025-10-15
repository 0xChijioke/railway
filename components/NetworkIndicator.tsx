"use client"

import { useChainId, useSwitchChain } from "wagmi"
import Image from "next/image"
import { NETWORK_META } from "@/config"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { toast } from "sonner"

export function NetworkIndicator() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const network = NETWORK_META[chainId]

  if (!network) return null

  const handleSwitch = async (targetId: number, name: string) => {
    try {
      switchChain({ chainId: targetId })
      toast.success(`Network switched to ${name}`, {
        duration: 3000,
        // position: "",
      })
    } catch (err) {
      console.error(err)
      toast.error(`Failed to switch network`, {
        description: "Unknown error",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-xl text-md font-bold tracking-wider px-2 py-4"
        >
          <Image src={network.logo} alt="" width={20} height={20} />
          <span className="hidden sm:inline text-sm font-medium">
            {network.name}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(NETWORK_META).map(([id, net]) => (
          <DropdownMenuItem
            key={id}
            onClick={() => handleSwitch(Number(id), net.name)}
            className="flex items-center gap-2 cursor-pointer"
            disabled={Number(id) === chainId}
          >
            <Image src={net.logo} alt="" width={16} height={16} />
            <span>{net.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}