import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-viem";
import "@nomicfoundation/hardhat-chai-matchers";

import { HardhatUserConfig } from "hardhat/config";

import * as dotenv from "dotenv";
import { subtask } from "hardhat/config";
import { TASK_COMPILE_SOLIDITY } from "hardhat/builtin-tasks/task-names";
import { join } from "path";
import { writeFile } from "fs/promises";
dotenv.config();

subtask(TASK_COMPILE_SOLIDITY).setAction(async (_, { config }, runSuper) => {
  const superRes = await runSuper();

  try {
    await writeFile(
      join(config.paths.root, "artifacts", "package.json"),
      '{ "type": "commonjs" }'
    );
  } catch (error) {
    console.error("Error writing package.json: ", error);
  }

  return superRes;
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: { enabled: true, runs: 5000 },
    },
  },
  etherscan: {
    apiKey: process.env.SCROLLSCAN_API_KEY,
    customChains: [
      {
        network: "sepoliaTestnet",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com",
        },
      },
    ],
  },

  networks: {
    sepoliaTestnet: {
      url: `https://sepolia-rpc.scroll.io`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },

    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
  },
};

export default config;
