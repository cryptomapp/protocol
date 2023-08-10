import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const XPFactory = await ethers.getContractFactory("XP");
  const xp = await XPFactory.deploy();
  await xp.waitForDeployment();
  console.log("XP contract deployed to:", await xp.getAddress());

  const CompliantFactory = await ethers.getContractFactory("Compliant");
  const compliant = await CompliantFactory.deploy();
  await compliant.waitForDeployment();
  console.log("Compliant contract deployed to:", await compliant.getAddress());

  const MerchantIDFactory = await ethers.getContractFactory("MerchantID");
  const merchantID = await MerchantIDFactory.deploy(
    xp.getAddress(),
    compliant.getAddress()
  );
  await merchantID.waitForDeployment();
  console.log(
    "MerchantID contract deployed to:",
    await merchantID.getAddress()
  );

  const MerchantRegistryFactory = await ethers.getContractFactory(
    "MerchantRegistry"
  );
  const merchantRegistry = await MerchantRegistryFactory.deploy(
    merchantID.getAddress()
  );
  await merchantRegistry.waitForDeployment();
  console.log(
    "MerchantRegistry contract deployed to:",
    await merchantRegistry.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
