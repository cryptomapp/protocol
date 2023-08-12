import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.BUILDBEAR_API_URL || "";
const PRIVATE_KEY = process.env.BUILDBEAR_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    buildbear: {
      url: API_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      buildbear: "verifyContract",
    },
    customChains: [
      {
        network: "buildbear",
        chainId: 10366,
        urls: {
          apiURL:
            "https://rpc.buildbear.io/verify/etherscan/past-raymus-antilles-a33a62e5",
          browserURL:
            "https://explorer.buildbear.io/past-raymus-antilles-a33a62e5",
        },
      },
    ],
  },
};

export default config;
