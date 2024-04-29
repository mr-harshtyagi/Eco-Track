import React from "react";
import { ProofData } from "@noir-lang/types";

const ZkProof = ({ proof }: { proof: ProofData | undefined }) => {
  return (
    <div className="w-full">
      <p className="text-lg font-bold">Here is your proof</p>
      <div className="p-4 h-60 overflow-y-auto">
        <code className="text-wrap w-full overflow-y-scroll ">
          {JSON.stringify(proof, null, 2)}
        </code>
      </div>
    </div>
  );
};

export default ZkProof;
