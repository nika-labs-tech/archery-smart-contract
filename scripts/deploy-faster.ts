import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Deploying Faster Token to Sei Network Testnet...");

  const connection = await network.connect("seitestnet");

  // Get treasury address from environment variable
  const treasuryAddress = process.env.TREASURY_ADDRESS as `0x${string}`;
  if (!treasuryAddress) {
    throw new Error("❌ TREASURY_ADDRESS environment variable is required");
  }

  console.log(`📋 Treasury Address: ${treasuryAddress}`);
  console.log(`🌐 Network: ${connection.networkName}`);

  // Deploy contract
  const faster = await connection.viem.deployContract("Faster", [treasuryAddress]);

  console.log("✅ Faster Token deployed successfully!");
  console.log(`📍 Contract Address: ${faster.address}`);
  console.log(`🔗 Explorer: https://seitrace.com/address/${faster.address}`);

  // Verify deployment details
  const totalSupply = await faster.read.totalSupply();
  const name = await faster.read.name();
  const symbol = await faster.read.symbol();
  const decimals = await faster.read.decimals();

  console.log("\n📊 Contract Details:");
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(
    `Total Supply: ${totalSupply.toString()} (${Number(totalSupply) / 1e18} tokens)`
  );

  // Check treasury balance
  const treasuryBalance = await faster.read.balanceOf([treasuryAddress]);
  console.log(
    `Treasury Balance: ${treasuryBalance.toString()} (${Number(treasuryBalance) / 1e18} tokens)`
  );

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next Steps:");
  console.log("1. Verify contract on Sei Explorer");
  console.log("2. Add liquidity to DEXs");
  console.log("3. Update frontend with contract address");
  console.log("4. Announce to community");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
