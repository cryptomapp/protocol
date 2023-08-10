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
    it("Should mint XP tokens by owner", async function () {
      await xp.mint(addr1.address, 100);
      expect(await xp.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should fail minting XP tokens by non-owner", async function () {
      await expect(
        xp.connect(addr1).mint(addr1.address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Burning", function () {
    it("Should burn XP tokens by owner", async function () {
      await xp.mint(addr1.address, 100);
      await xp.burn(addr1.address, 50);
      expect(await xp.balanceOf(addr1.address)).to.equal(50);
    });

    it("Should fail burning XP tokens by non-owner", async function () {
      await xp.mint(addr1.address, 100);
      await expect(
        xp.connect(addr1).burn(addr1.address, 50)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
