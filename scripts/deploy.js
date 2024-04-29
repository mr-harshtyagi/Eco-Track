import { abi } from "@noir-lang/noir_js";
import { writeFileSync } from "fs";
import hre from "hardhat";
const { viem } = hre;

async function main() {
  const publicClient = await viem.getPublicClient();

  // Deploy the verifier contract
  const verifier = await viem.deployContract("UltraVerifier");

  // Deploy the EcoTrack contract
  const ecoTrack = await viem.deployContract("EcoTrack");

  // Create a config object
  const config = {
    chainId: publicClient.chain.id,
    verifier: verifier.address,
    ecoTrack: ecoTrack.address,
    verifierAbi: verifier.abi,
    ecoTrackAbi: ecoTrack.abi,
  };

  // Print the config
  console.log("Deployed at", config);
  writeFileSync("utils/addresses.json", JSON.stringify(config), { flag: "w" });
  process.exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
