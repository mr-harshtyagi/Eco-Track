import { createConfig } from "wagmi";
import { hardhat, scrollSepolia } from "wagmi/chains";
import addresses from "./addresses.json";
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
  getDefaultConfig({
    appName: "eco-track",
    walletConnectProjectId: "2c47228d7859d86f61278d79d5df9723",
    chains: [scrollSepolia, hardhat],
  })
);

export const verifierContractCallConfig = {
  address: addresses.verifier as `0x${string}`,
  abi: addresses.verifierAbi,
  chainId: addresses.chainId,
  functionName: "verify",
};

export const ecoTrackContractCallConfig = {
  address: addresses.ecoTrack as `0x${string}`,
  abi: addresses.ecoTrackAbi,
  chainId: addresses.chainId,
};
