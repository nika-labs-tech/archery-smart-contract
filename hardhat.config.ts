import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  plugins: [
    hardhatToolboxViemPlugin
  ],
  solidity: {
    version: "0.8.30",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  networks: {
    seitestnet: {
      type: "http",
      chainType: "l1",
      url: "https://evm-rpc-testnet.sei-apis.com",
      accounts: [process.env.SEI_PRIVATE_KEY || ""],
      chainId: 1328,
    },
    seimainnet: {
      type: "http",
      chainType: "l1",
      url: "https://evm-rpc.sei-apis.com",
      accounts: [process.env.SEI_PRIVATE_KEY || ""],
      chainId: 1329,
    }
  },
  verify: {
    blockscout: {
      enabled: true,
    },
  },
  chainDescriptors: {
    1328: {
      name: "sei_atlantic_2",
      blockExplorers: {
        blockscout: {
          name: "Seitrace",
          url: "https://seitrace.com",
          apiUrl: "https://seitrace.com/atlantic-2/api",
        },
      },
    },
    1329: {
      name: "sei_pacific_1",
      blockExplorers: {
        blockscout: {
          name: "Seitrace",
          url: "https://seitrace.com",
          apiUrl: "https://seitrace.com/pacific-1/api",
        },
      },
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
  },
};

export default config;
