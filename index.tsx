import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Component from './components/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import initNoirWasm from '@noir-lang/noir_wasm';
import initNoirC from '@noir-lang/noirc_abi';
import initACVM from '@noir-lang/acvm_js';
import { WagmiConfig } from 'wagmi';
import { config } from './utils/wagmi';

const InitWasm = ({ children }) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        initNoirWasm(
          new URL('@noir-lang/noir_wasm/web/noir_wasm_bg.wasm', import.meta.url).toString(),
        ),
        initACVM(new URL('@noir-lang/acvm_js/web/acvm_js_bg.wasm', import.meta.url).toString()),
        initNoirC(
          new URL('@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', import.meta.url).toString(),
        ),
      ]);
      setInit(true);
    })();
  });

  return <div>{init && children}</div>;
};
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // const [mounted, setMounted] = React.useState(false);
  // React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode theme="rounded">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Web3Provider>
    <InitWasm>
      <Component />
      <ToastContainer />
    </InitWasm>
  </Web3Provider>,
);
