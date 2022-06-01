import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

dotenv.config({ path: "./.env" });

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [
        process.env.PRIVATE_KEY as string
      ],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY
    }
  },
};

export default config;