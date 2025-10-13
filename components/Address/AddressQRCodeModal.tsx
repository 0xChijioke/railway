"use client";

import { QRCodeSVG } from "qrcode.react";
import { Address as AddressType } from "viem";
import { Address } from "@/components/Address/Address";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

type AddressQRCodeModalProps = {
  address: AddressType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddressQRCodeModal = ({ address, open, onOpenChange }: AddressQRCodeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md">
        <DialogHeader>
          <DialogTitle>Wallet QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <QRCodeSVG value={address} size={256} />
          <Address address={address} format="long" disableAddressLink onlyEnsOrAddress />
        </div>
        <DialogClose className="btn btn-ghost absolute right-3 top-3"></DialogClose>
      </DialogContent>
    </Dialog>
  );
};
