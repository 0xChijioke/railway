"use client";

import { blo } from "blo";
import { GetEnsAvatarReturnType } from "viem/ens";

// Custom Avatar for RainbowKit
export const BlockieAvatar = ({ address, ensImage, size }: { address: string; ensImage?: GetEnsAvatarReturnType; size: number }) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full"
    src={ensImage || blo(address as `0x${string}`)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
);
