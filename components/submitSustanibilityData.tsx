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
import { DataForm } from "./form.jsx";

export default function SubmitSustanibilityData({ setRecheck }: any) {
  return (
    <div className="">
      <Dialog>
        <DialogTrigger>
          <Button variant="default" size={"lg"}>
            Submit Sustainibility Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Fill the required details for your company
            </DialogTitle>
            <DialogDescription>
              Please make sure the entered details are correct. You will not be
              able to update once you submit the proof on the blockchain.
            </DialogDescription>
            <div className="flex justify-center">
              <DataForm />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
