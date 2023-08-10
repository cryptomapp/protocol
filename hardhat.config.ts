import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.BUILDBEAR_API_URL || "";
const PRIVATE_KEY = process.env.BUILDBEAR_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "buildbear",
  networks: {
    hardhat: {},
    buildbear: {
      url: API_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
