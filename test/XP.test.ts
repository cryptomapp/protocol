import { ethers } from "hardhat";
import { XP } from "../typechain-types/contracts/XP";
import { expect } from "chai";

describe("XP Contract", function () {
  let xp: XP;
  let owner: any;
  let addr1: any;
  let addrs: any;

  beforeEach(async function () {
    const XPFactory = await ethers.getContractFactory("XP");
    [owner, addr1, ...addrs] = await ethers.getSigners();
    xp = (await XPFactory.deploy()) as XP;
  });

  describe("Minting", function () {
    it("Should mint XP tokens", async function () {
      await xp.mint(addr1.address, 100);
      expect(await xp.balanceOf(addr1.address)).to.equal(100);
    });
  });

  describe("Burning", function () {
    it("Should burn XP tokens", async function () {
      await xp.mint(addr1.address, 100);
      await xp.connect(addr1).burn(50);
      expect(await xp.balanceOf(addr1.address)).to.equal(50);
    });
  });
});
