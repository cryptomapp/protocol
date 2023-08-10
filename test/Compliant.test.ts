// import { ethers } from "hardhat";
// import { expect } from "chai";
// import { Compliant } from "../typechain-types/contracts/Compliant";

// describe("Compliant", function () {
//   let compliant: Compliant;
//   let owner: any;
//   let addr1: any;
//   let addrs: any;

//   beforeEach(async function () {
//     const CompliantFactory = await ethers.getContractFactory("Compliant");
//     [owner, addr1, ...addrs] = await ethers.getSigners();
//     compliant = (await CompliantFactory.deploy()) as Compliant;
//     await compliant.waitForDeployment();
//   });

//   describe("Minting Compliants", function () {
//     it("Should mint a compliant", async function () {
//       const description = "Test compliant";
//       const tx = await compliant.mint(addr1.address, description);
//       const receipt = await tx.wait();

//       if (!receipt?.logs || receipt.logs.length === 0) {
//         throw new Error("No logs found in transaction receipt");
//       }

//       const eventFragment = compliant.interface.getEvent("NewComplaint");
//       if (!eventFragment) {
//         throw new Error("Event NewComplaint not found in the contract ABI");
//       }

//       const log = receipt.logs.find(
//         (log) => log.topics[0] === eventFragment.name
//       );
//       if (!log) {
//         throw new Error("NewComplaint event not found in logs");
//       }

//       const parsedLog = compliant.interface.parseLog(log);
//       const tokenId = parsedLog?.args?.merchantID;

//       expect(await compliant.ownerOf(tokenId)).to.equal(addr1.address);
//       const data = await compliant.getCompliant(tokenId);
//       expect(data.description).to.equal(description);
//       expect(data.resolved).to.equal(false);
//     });

//     it("Should allow the compliant owner to resolve it", async function () {
//       const description = "Another Test Compliant";
//       const tx = await compliant.mint(addr1.address, description);
//       const receipt = await tx.wait();

//       const eventFragment = compliant.interface.getEvent("NewComplaint");
//       const log = receipt?.logs.find(
//         (log) => log.topics[0] === eventFragment.name
//       );
//       const parsedLog = compliant.interface.parseLog(log);
//       const tokenId = parsedLog?.args?.merchantID;

//       await compliant.connect(addr1).resolveCompliant(tokenId);
//       const data = await compliant.getCompliant(tokenId);
//       expect(data.resolved).to.equal(true);
//     });

//     it("Should not allow someone else to resolve a compliant", async function () {
//       const description = "Yet Another Test Compliant";
//       const tx = await compliant.mint(addr1.address, description);
//       const receipt = await tx.wait();

//       const eventFragment = compliant.interface.getEvent("NewComplaint");
//       const log = receipt?.logs.find(
//         (log) => log.topics[0] === eventFragment.name
//       );
//       const parsedLog = compliant.interface.parseLog(log);
//       const tokenId = parsedLog?.args?.merchantID;

//       await expect(
//         compliant.connect(addrs[0]).resolveCompliant(tokenId)
//       ).to.be.revertedWith("Not the owner of this compliant");
//     });
//   });
// });
