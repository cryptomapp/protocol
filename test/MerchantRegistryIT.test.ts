import { ethers } from "hardhat";
import { expect } from "chai";
import { MerchantID } from "../typechain-types/contracts/MerchantID";
import { MerchantRegistry } from "../typechain-types/contracts/MerchantRegistry";

describe("Merchant Contracts", function () {
  let merchantID: MerchantID;
  let merchantRegistry: MerchantRegistry;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    const MerchantIDFactory = await ethers.getContractFactory("MerchantID");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    merchantID = (await MerchantIDFactory.deploy()) as MerchantID;

    const MerchantRegistryFactory = await ethers.getContractFactory(
      "MerchantRegistry"
    );
    merchantRegistry = (await MerchantRegistryFactory.deploy(
      await merchantID.getAddress()
    )) as MerchantRegistry;
  });

  describe("MerchantID", function () {
    it("Should mint new MerchantID token with given IPFS hash", async function () {
      const ipfsHash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o";
      await merchantID.mint(addr1.address, ipfsHash);
      expect(await merchantID.uri(1)).to.equal(ipfsHash);
    });

    it("Owner should be able to update the IPFS hash", async function () {
      const ipfsHash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o";
      const newIpfsHash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff6z";
      await merchantID.mint(addr1.address, ipfsHash);
      await merchantID.connect(addr1).setTokenURI(1, newIpfsHash);
      expect(await merchantID.uri(1)).to.equal(newIpfsHash);
    });
  });

  describe("MerchantRegistry", function () {
    it("Should allow merchant registration and emit event", async function () {
      const ipfsHash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o";
      await expect(merchantRegistry.register(ipfsHash))
        .to.emit(merchantRegistry, "MerchantRegistered")
        .withArgs(owner.address, 1, ipfsHash);
    });

    it("Should prevent duplicate merchant registration", async function () {
      const ipfsHash = "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o";
      await merchantRegistry.register(ipfsHash);
      await expect(merchantRegistry.register(ipfsHash)).to.be.revertedWith(
        "Merchant already registered"
      );
    });
  });
});
