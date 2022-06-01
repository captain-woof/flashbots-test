import { BigNumber, ethers } from "ethers";
import TestNftContractArtifact from "../artifacts/contracts/TestNFT.sol/TestNFT.json";
import { TestNFT } from "../typechain";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";

// Constants
const TEST_NFT_CONTRACT_ADDR = "0x1341e91a0570E461151212DCa87948F50948172a";

async function main() {
    const provider = new ethers.providers.WebSocketProvider(`wss://goerli.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    const testNftContract = new ethers.Contract(TEST_NFT_CONTRACT_ADDR, TestNftContractArtifact.abi, signer) as TestNFT;

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        signer,
        "https://relay-goerli.flashbots.net",
        "goerli"
    );

    provider.on("block", async (blockNumber) => {
        console.log("Sending in Block #", blockNumber + 1);
        const bundleResponse = await flashbotsProvider.sendBundle(
            [
                {
                    transaction: {
                        // ChainId for the Goerli network
                        chainId: 5,
                        // EIP-1559
                        type: 2,
                        // Value of 1 FakeNFT
                        value: ethers.utils.parseEther("0.00001"),
                        // Address of the FakeNFT
                        to: TEST_NFT_CONTRACT_ADDR,
                        // In the data field, we pass the function selctor of the mint function
                        data: testNftContract.interface.getSighash("mint()"),
                        // Max Gas Fes you are willing to pay
                        maxFeePerGas: BigNumber.from(10).pow(9).mul(3),
                        // Max Priority gas fees you are willing to pay
                        maxPriorityFeePerGas: BigNumber.from(10).pow(9).mul(2),
                    },
                    signer: signer,
                },
            ],
            blockNumber + 1
        ) as any;
        // If an error is present, log it
        if ("error" in bundleResponse) {
            console.log(bundleResponse.error.message);
        }
        await bundleResponse.wait();
    });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
