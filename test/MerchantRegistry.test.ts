import { ethers } from "hardhat";
import { expect } from "chai";
import { MerchantID } from "../typechain-types/contracts/MerchantID";
import { MerchantRegistry } from "../typechain-types/contracts/MerchantRegistry";
import { XP } from "../typechain-types/contracts/XP";
import { Compliant } from "../typechain-types/contracts/Compliant";

describe("Merchant Registry", function () {
  let merchantID: MerchantID;
  let merchantRegistry: MerchantRegistry;
  let xp: XP;
  let compliant: Compliant;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    const XPFactory = await ethers.getContractFactory("XP");
    xp = (await XPFactory.deploy()) as XP;

    const CompliantFactory = await ethers.getContractFactory("Compliant");
    compliant = (await CompliantFactory.deploy()) as Compliant;

    const MerchantIDFactory = await ethers.getContractFactory("MerchantID");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    merchantID = (await MerchantIDFactory.deploy(
      await xp.getAddress(),
      await compliant.getAddress()
    )) as MerchantID;

    const MerchantRegistryFactory = await ethers.getContractFactory(
      "MerchantRegistry"
    );
    merchantRegistry = (await MerchantRegistryFactory.deploy(
      await merchantID.getAddress()
    )) as MerchantRegistry;
  });

  it("Should allow merchant registration and emit event", async function () {
    const arweaveID = "arweave-id-example-123";
    await expect(merchantRegistry.register(addr1.address, arweaveID))
      .to.emit(merchantRegistry, "NewMerchantRegistered")
      .withArgs(addr1.address, 1, arweaveID);
  });

  it("Should prevent duplicate merchant registration", async function () {
    const arweaveID = "arweave-id-example-123";
    await merchantRegistry.register(addr1.address, arweaveID);
    await expect(
      merchantRegistry.register(addr1.address, arweaveID)
    ).to.be.revertedWith("Merchant already registered");
  });
});
