// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { MerchantID } from "../typechain-types/contracts/MerchantID";
// import { XP } from "../typechain-types/contracts/XP";
// import { Compliant } from "../typechain-types/contracts/Compliant";

// describe("MerchantID", function () {
//   let merchantID: MerchantID;
//   let xp: XP;
//   let compliant: Compliant;
//   let owner: any;
//   let addr1: any;
//   let addr2: any;
//   let addrs: any;

//   beforeEach(async function () {
//     const XPFactory = await ethers.getContractFactory("XP");
//     xp = (await XPFactory.deploy()) as XP;

//     const CompliantFactory = await ethers.getContractFactory("Compliant");
//     compliant = (await CompliantFactory.deploy()) as Compliant;

//     const MerchantIDFactory = await ethers.getContractFactory("MerchantID");
//     [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
//     merchantID = (await MerchantIDFactory.deploy(
//       await xp.getAddress(),
//       await compliant.getAddress()
//     )) as MerchantID;
//   });

//   async function mintAndGetTokenId(
//     arweaveID: string,
//     to: any
//   ): Promise<number> {
//     // Mint the token
//     const tx = await merchantID.mint(to.address, arweaveID);
//     const receipt = await tx.wait();

//     // Find the Minted event in the transaction receipt
//     const mintedEvent = receipt?.events?.find(
//       (e) => e.event === "TransferSingle"
//     ); // ERC1155 uses TransferSingle event
//     if (!mintedEvent || !mintedEvent.args)
//       throw new Error("Minted event not found");

//     const tokenId = mintedEvent.args[3]; // The ID of the newly minted token should be the fourth argument in the TransferSingle event

//     return tokenId.toNumber(); // Convert BigNumber to number
//   }

//   it("Should mint new MerchantID token with given Arweave ID", async function () {
//     const arweaveID = "arweave-id-example-123";
//     const tokenId = await mintAndGetTokenId(arweaveID, addr1);
//     expect(await merchantID.getMerchantData(tokenId)).to.equal(arweaveID);
//   });

//   it("Owner should be able to update the Arweave ID", async function () {
//     const arweaveID = "arweave-id-example-123";
//     const newArweaveID = "arweave-id-updated-456";
//     const tokenId = await mintAndGetTokenId(arweaveID, addr1);

//     await merchantID.connect(addr1).updateMerchantData(tokenId, newArweaveID);
//     expect(await merchantID.getMerchantData(tokenId)).to.equal(newArweaveID);
//   });
// });
