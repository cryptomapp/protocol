import { ethers } from "hardhat";
import { expect } from "chai";
import { MerchantID } from "../typechain-types/contracts/MerchantID";
import { MerchantRegistry } from "../typechain-types/contracts/MerchantRegistry";
import { TransactionRegistry } from "../typechain-types/contracts/TransactionRegistry";
import { Compliant } from "../typechain-types/contracts/Compliant";
import { MockUSDC } from "../typechain-types/contracts/MockUSDC";
import { XP } from "../typechain-types/contracts/XP";

describe("Transaction Registry", function () {
  let merchantID: MerchantID;
  let merchantRegistry: MerchantRegistry;
  let transactionRegistry: TransactionRegistry;
  let usdc: MockUSDC;
  let xp: XP;
  let compliant: Compliant;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  beforeEach(async function () {
    const USDCFactory = await ethers.getContractFactory("MockUSDC");
    usdc = (await USDCFactory.deploy()) as MockUSDC;

    const XPFactory = await ethers.getContractFactory("XP");
    xp = (await XPFactory.deploy()) as XP;

    const CompliantFactory = await ethers.getContractFactory("Compliant");
    compliant = (await CompliantFactory.deploy()) as Compliant;

    const MerchantIDFactory = await ethers.getContractFactory("MerchantID");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    await usdc.mint(addr2.getAddress(), ethers.parseUnits("10000", 6)); // minting some USDC to addr2 for testing

    merchantID = (await MerchantIDFactory.deploy(
      xp.getAddress(),
      compliant.getAddress()
    )) as MerchantID;

    const MerchantRegistryFactory = await ethers.getContractFactory(
      "MerchantRegistry"
    );
    merchantRegistry = (await MerchantRegistryFactory.deploy(
      merchantID.getAddress()
    )) as MerchantRegistry;

    const TransactionRegistryFactory = await ethers.getContractFactory(
      "TransactionRegistry"
    );
    transactionRegistry = (await TransactionRegistryFactory.deploy(
      merchantRegistry.getAddress()
    )) as TransactionRegistry;
  });

  it("Should execute a transaction, transfer 99.7% to merchant and 0.3% to owner", async function () {
    const totalAmount = ethers.parseUnits("1", 6); // USDC has 6 decimals
    const arweaveID = "arweave-id-example-123";

    // Register the merchant before executing the transaction
    await merchantRegistry.register(addr1.getAddress(), arweaveID);

    await usdc
      .connect(addr2)
      .approve(transactionRegistry.getAddress(), totalAmount);

    const expectedFee = (totalAmount * 3n) / 1000n;
    const expectedMerchantAmount = totalAmount - expectedFee;

    await transactionRegistry
      .connect(addr2)
      .executeTransaction(totalAmount, usdc.getAddress(), addr1.getAddress());

    expect(await usdc.balanceOf(addr1.getAddress())).to.equal(
      expectedMerchantAmount
    );
    expect(await usdc.balanceOf(owner.getAddress())).to.equal(expectedFee);
  });
});
