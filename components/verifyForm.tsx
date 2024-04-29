import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { ProofData } from "@noir-lang/types";
import { toast } from "react-toastify";
import { Noir } from "@noir-lang/noir_js";
import {
  BarretenbergBackend,
  flattenPublicInputs,
} from "@noir-lang/backend_barretenberg";
import { Button } from "./ui/button.jsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form.jsx";
import { Input } from "./ui/input.jsx";
import ZkProof from "./zkProof.jsx";
import { compile, PathToFileSourceMap } from "@noir-lang/noir_wasm";
import { useEffect } from "react";
import { bytesToHex } from "viem";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import addresses from "./../utils/addresses.json";
import { scrollSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import Spinner from "./spinner.jsx";
import { isAddress } from "viem";
import VerifyZkProof from "./verifyZkProof.jsx";

const formSchema = z.object({
  companyWalletAddress: z.string().refine((value) => isAddress(value), {
    message: "Provided address is invalid.",
  }),
});

interface CompanyDetails {
  name: string;
  regNo: string;
  emissionsCategory: string;
}

export function VerifyDataForm() {
  const [proof, setProof] = useState<string>();
  const [publicInputs, setPublicInputs] = useState<string[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>();
  const [loading, setLoaading] = useState<boolean>(false);
  const { address } = useAccount();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyWalletAddress: "",
    },
  });

  async function verifyProof() {
    // get proof from smart contract
    setLoaading(true);

    console.log("Proof: ", proof);
    console.log("Public Inputs: ", publicInputs);

    const publicClient = createPublicClient({
      chain: scrollSepolia,
      transport: http(),
    });

    try {
      const result: any = await publicClient.readContract({
        address: addresses.verifier as any,
        abi: addresses.verifierAbi,
        functionName: "verify",
        args: [proof, publicInputs],
      });

      console.log("Result: ", result);

      toast.success("Proof verified successfuly.");

      setLoaading(false);
    } catch (error) {
      toast.error("Proof verification failed.");
      setLoaading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form values are type-safe and validated.
    console.log(values);
    // get proof from smart contract
    setLoaading(true);

    const publicClient = createPublicClient({
      chain: scrollSepolia,
      transport: http(),
    });

    try {
      const result: any = await publicClient.readContract({
        address: addresses.ecoTrack as any,
        abi: addresses.ecoTrackAbi,
        functionName: "getSustainabilityData",
        args: [values.companyWalletAddress],
      });

      console.log("Result: ", result);
      if (result[5] == true) {
        toast.success("Proof found on chain.");
        setProof(result[3]);
        setPublicInputs(result[4]);
        setCompanyDetails({
          name: result[0],
          regNo: result[1],
          emissionsCategory:
            result[2] == 0 ? "Low" : result[2] == 1 ? "Medium" : "High",
        });
        setLoaading(false);
      } else {
        toast.error("Proof not found on chain.");
        setLoaading(false);
      }
    } catch (error) {
      toast.error("Proof not found on chain.");
      setLoaading(false);
    }
  }

  return (
    <>
      {!proof ? (
        <div className="w-[50%] mt-8">
          {!loading ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="companyWalletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company's Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x000000000000000000" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                  This is your public company name.
                </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-4">
                  <Button type="submit">Fetch Proof</Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="flex justify-center items-center mt-28">
              <Spinner />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-[90%] py-4">
          {!loading ? (
            <>
              <div className="flex flex-col justify-center items-center text-lg">
                <p>Company Name : {companyDetails?.name}</p>
                <p>Company Registration No : {companyDetails?.regNo}</p>
                <p>Emissions Category : {companyDetails?.emissionsCategory}</p>
              </div>
              <VerifyZkProof proof={proof} />
              <div className="flex flex-col gap-4 items-center justify-center">
                <Button onClick={verifyProof}>Verify Proof On Chain</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center mt-28 gap-4">
              <Spinner />
              <p>Verifying Proof on chain ...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
