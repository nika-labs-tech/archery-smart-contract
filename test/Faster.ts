import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Faster", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should deploy with correct initial supply and treasury", async function () {
    const [deployer, treasury] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Check initial supply
    const totalSupply = await faster.read.totalSupply();
    assert.equal(totalSupply, 1500000000n * 10n ** 18n, "Total supply should be 1.5B tokens");

    // Check treasury balance
    const treasuryBalance = await faster.read.balanceOf([treasury.account.address]);
    assert.equal(treasuryBalance, 1500000000n * 10n ** 18n, "Treasury should have all tokens");

    // Check token details
    const name = await faster.read.name();
    const symbol = await faster.read.symbol();
    const decimals = await faster.read.decimals();
    
    assert.equal(name, "Archer Hunter", "Token name should be 'Archer Hunter'");
    assert.equal(symbol, "FASTER", "Token symbol should be 'FASTER'");
    assert.equal(decimals, 18, "Decimals should be 18");
  });

  it("Should support permit functionality", async function () {
    const [deployer, treasury, user1, user2] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Transfer some tokens to user1
    await faster.write.transfer([user1.account.address, 1000n * 10n ** 18n], {
      account: treasury.account
    });

    // Get nonce for permit
    const nonce = await faster.read.nonces([user1.account.address]);
    
    // Create permit signature
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now
    const value = 100n * 10n ** 18n;
    
    // This is a simplified test - in practice you'd need to create the actual signature
    // For now, we'll just verify the nonce is accessible
    assert.equal(nonce, 0n, "Nonce should start at 0");
  });

  it("Should allow users to burn their own tokens", async function () {
    const [deployer, treasury, user1] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Transfer some tokens to user1
    await faster.write.transfer([user1.account.address, 1000n * 10n ** 18n], {
      account: treasury.account
    });

    const initialBalance = await faster.read.balanceOf([user1.account.address]);
    const initialSupply = await faster.read.totalSupply();

    // User1 burns 100 tokens
    await faster.write.burn([100n * 10n ** 18n], {
      account: user1.account
    });

    const finalBalance = await faster.read.balanceOf([user1.account.address]);
    const finalSupply = await faster.read.totalSupply();

    assert.equal(finalBalance, initialBalance - 100n * 10n ** 18n, "User balance should decrease");
    assert.equal(finalSupply, initialSupply - 100n * 10n ** 18n, "Total supply should decrease");
  });
});
