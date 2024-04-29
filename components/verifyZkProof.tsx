import React from "react";
import { ProofData } from "@noir-lang/types";
import { bytesToHex } from "viem";

const VerifyZkProof = ({ proof }: { proof: string }) => {
  if (!proof) return null;
  const [zkProof, setZkProof] = React.useState<string>(proof);

  return (
    <div className="">
      <p className="text-lg font-bold">ZK Proof</p>
      <div className="p-4 h-40 overflow-y-auto w-full">
        <p className=" break-words text-wrap w-[800px]">{zkProof}</p>
      </div>
    </div>
  );
};

export default VerifyZkProof;
