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
import { useContractRead, useContractWrite } from "wagmi";
import addresses from "./../utils/addresses.json";
import { scrollSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import Spinner from "./spinner.jsx";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  registrationNumber: z.string().min(6, {
    message: "Company registration must be at least 6 characters.",
  }),
  emissions: z.coerce.number().gte(0, "Must be 0 and above"),
});

async function getCircuit(name: string) {
  const res = await fetch(new URL("../circuits/src/main.nr", import.meta.url));
  const noirSource = await res.text();

  const sourceMap = new PathToFileSourceMap();
  sourceMap.add_source_code("main.nr", noirSource);
  const compiled = compile("main.nr", undefined, undefined, sourceMap);
  return compiled;
}

function getEmissionsCategory(score: number): string {
  if (score >= 500) return "__high___";
  if (score >= 101) return "__medium_";
  if (score <= 100) return "__low____";
  return "__";
}

function getEmissionsCategoryIndex(score: number): number {
  if (score >= 500) return 2;
  if (score >= 101) return 1;
  if (score <= 100) return 0;
  return 0;
}

export function DataForm() {
  const [proof, setProof] = useState<ProofData | undefined>();
  const [noir, setNoir] = useState<Noir | undefined>();
  const [backend, setBackend] = useState<BarretenbergBackend | null>(null);
  const [loading, setLoaading] = useState<boolean>(false);

  const { write, isLoading } = useContractWrite({
    address: addresses.ecoTrack as any,
    abi: addresses.ecoTrackAbi,
    functionName: "submitSustainabilityData",
    onSuccess: () => {
      toast.success("Proof submitted successfully");
    },
    onError: (error) => {
      toast.error("Error submitting proof on chain");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
    },
  });

  const initNoir = async () => {
    const circuit = await getCircuit("main");
    if (noir) {
      return;
    }
    // @ts-ignore
    const backend = new BarretenbergBackend(circuit.program, { threads: 8 });
    setBackend(backend);

    // @ts-ignore
    const noirInstance = new Noir(circuit.program, backend);
    await toast.promise(noirInstance.init(), {
      pending: "Initializing Noir...",
      success: "Noir initialized!",
      error: "Error initializing Noir",
    });
    setNoir(noirInstance);
  };

  // Calculates proof
  const calculateProof = async (input: {
    emissions: number;
    emissionsCategory: string;
  }) => {
    const calc = new Promise(async (resolve, reject) => {
      console.log("Input: ", input);

      const data = await noir!.generateFinalProof(input);
      console.log("Proof created: ", data);

      setProof(data);
      setLoaading(false);
      resolve(data);
    });
    toast.promise(calc, {
      pending: "Calculating proof...",
      success: "Proof calculated!",
      error: "Error calculating proof",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form values are type-safe and validated.
    console.log(values);
    setLoaading(true);
    const category = getEmissionsCategory(values.emissions);
    console.log("Generating proof");
    await calculateProof({
      emissions: values.emissions,
      emissionsCategory: category,
    });
  }

  async function handleProofSubmit() {
    setLoaading(true);
    console.log("Submitting proof on chain");
    const proofData = proof!;
    console.log("Proof data: ", proofData);
    const proofHex = bytesToHex(proofData.proof);
    console.log("Proof hex: ", proofHex);
    const publicInputs = flattenPublicInputs(proofData.publicInputs);
    console.log("Public inputs: ", publicInputs);

    write({
      args: [
        form.getValues().companyName,
        form.getValues().registrationNumber,
        getEmissionsCategoryIndex(form.getValues().emissions),
        proofHex,
        publicInputs,
      ],
    });
  }

  useEffect(() => {
    initNoir();
  }, []);

  return (
    <>
      {!proof ? (
        <div className="w-[50%]">
          {!loading ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Apple Inc." {...field} />
                      </FormControl>
                      {/* <FormDescription>
                  This is your public company name.
                </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="U30007KA199" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                  This is your registered company number.
                </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emissions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CO<sub>2</sub> Emissions (in tons/year)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This information will not be public. Only emissions
                        category will be public.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button type="submit">Generate ZK Proof</Button>
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
        <div className="flex flex-col gap-8 w-[90%] py-2">
          {!isLoading ? (
            <>
              <ZkProof
                proof={proof}
                emissionsCategory={getEmissionsCategory(
                  form.getValues().emissions
                )}
              />
              <div className="flex flex-col gap-4 items-center justify-center">
                <Button onClick={handleProofSubmit}>
                  Submit Proof On Chain
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center mt-28 gap-4">
              <Spinner />
              <p>Submitting Proof on chain...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
