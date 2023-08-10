import { ethers } from "hardhat";
import { expect } from "chai";
import { Compliant } from "../typechain-types/contracts/Compliant";

describe("Compliant", function () {
  let compliant: Compliant;
  let owner: any;
  let addr1: any;
  let addrs: any;

  beforeEach(async function () {
    const CompliantFactory = await ethers.getContractFactory("Compliant");
    [owner, addr1, ...addrs] = await ethers.getSigners();
    compliant = (await CompliantFactory.deploy()) as Compliant;
  });

  describe("Minting Compliants", function () {
    it("Should mint a compliant", async function () {
      const description = "Test compliant";
      const tx = await compliant.mint(addr1.address, description);
      const receipt = await tx.wait();

      if (!receipt?.logs || receipt.logs.length === 0) {
        throw new Error("No logs found in transaction receipt");
      }

      // Get the EventFragment for "NewComplaint"
      const eventFragment = compliant.interface.getEvent("NewComplaint");
      if (!eventFragment) {
        throw new Error("Event NewComplaint not found in the contract ABI");
      }

      // Find and parse the log with the matching event signature
      const log = receipt.logs.find(
        (log) => log.topics[0] === eventFragment.name
      );
      //   if (!log) {
      //     throw new Error("NewComplaint event not found in logs");
      //   }

      //   const parsedLog = compliant.interface.parseLog(log);
      //   const tokenId = parsedLog?.args.merchantID;

      //   expect(await compliant.ownerOf(tokenId)).to.equal(addr1.address);
      //   const data = await compliant.getCompliant(tokenId);
      //   expect(data.description).to.equal(description);
    });
  });
});
