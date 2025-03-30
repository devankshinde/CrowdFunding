const hre = require("hardhat");

async function main() {
  console.log("📦 Deploying CrowdFunding contract...");

  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const contract = await CrowdFunding.deploy(); // Ethers v6 doesn't use `.deployed()`

  console.log(`✅ Contract deployed at: ${contract.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
