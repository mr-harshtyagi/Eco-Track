import { createConfig, configureChains } from 'wagmi';
import { hardhat, scrollSepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import abi from './verifierAbi.json';
import addresses from './addresses.json';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    appName: 'zkCreditScore',
    walletConnectProjectId: '2c47228d7859d86f61278d79d5df9723',
    chains: [scrollSepolia, hardhat],
  }),
);

export const contractCallConfig = {
  address: addresses.verifier as `0x${string}`,
  abi,
  chainId: addresses.chainId,
  functionName: 'verify',
};
