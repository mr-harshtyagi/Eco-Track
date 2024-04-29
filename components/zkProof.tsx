import React from "react";
import { ProofData } from "@noir-lang/types";
import { bytesToHex } from "viem";

function categoryToText(category: string): React.ReactNode {
  if (category === "__high___")
    return <p className="text-2xl text-red-600 font-bold p-2"> High</p>;
  if (category === "__medium_")
    return <p className="text-2xl text-yellow-600 font-bold p-2">Medium</p>;
  if (category === "__low____")
    return <p className="text-2xl text-green-600 font-bold p-2">Low</p>;
  return <p className="text-2xl text-gray-600 font-bold p-2">Unknown</p>;
}

const ZkProof = ({
  proof,
  emissionsCategory,
}: {
  proof: ProofData | undefined;
  emissionsCategory: string;
}) => {
  if (!proof) return null;
  const [zkProof, setZkProof] = React.useState<string>(bytesToHex(proof.proof));

  console.log(emissionsCategory);

  return (
    <div className="w-full">
      <p className="text-lg font-bold">Here is your proof</p>
      <div className="p-4 h-60 overflow-y-auto">
        <code className="text-wrap w-full overflow-y-scroll flex-wrap break-words">
          {JSON.stringify(proof.proof, null, 2)}
          {/* {zkProof} */}
        </code>
      </div>
      <div className="flex justify-center items-center">
        <p>Your Emission Category is </p> {categoryToText(emissionsCategory)}
      </div>
    </div>
  );
};

export default ZkProof;
