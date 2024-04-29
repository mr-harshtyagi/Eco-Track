import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.jsx";
import { Button } from "./ui/button.jsx";
import { VerifyDataForm } from "./verifyForm.jsx";

export default function VerifyProof({ setRecheck }: any) {
  return (
    <div className="">
      <Dialog>
        <DialogTrigger>
          <Button variant={"secondary"} size={"lg"}>
            Verify Proof
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              View the proof of a company's sustainability report
            </DialogTitle>
            <DialogDescription>
              You can verify the proof of a company's sustainability report
              on-chain.
            </DialogDescription>
            <div className="flex justify-center">
              <VerifyDataForm />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
