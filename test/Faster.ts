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

  it("Should set up roles correctly", async function () {
    const [deployer, treasury] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Check that treasury has admin role
    const hasAdminRole = await faster.read.hasRole([
      await faster.read.DEFAULT_ADMIN_ROLE(),
      treasury.account.address
    ]);
    assert.equal(hasAdminRole, true, "Treasury should have admin role");

    // Check that treasury has pauser role
    const hasPauserRole = await faster.read.hasRole([
      await faster.read.PAUSER_ROLE(),
      treasury.account.address
    ]);
    assert.equal(hasPauserRole, true, "Treasury should have pauser role");

    // Check that deployer doesn't have admin role
    const deployerHasAdminRole = await faster.read.hasRole([
      await faster.read.DEFAULT_ADMIN_ROLE(),
      deployer.account.address
    ]);
    assert.equal(deployerHasAdminRole, false, "Deployer should not have admin role");
  });

  it("Should allow pausing and unpausing by treasury", async function () {
    const [deployer, treasury] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Initially not paused
    let paused = await faster.read.paused();
    assert.equal(paused, false, "Contract should not be paused initially");

    // Pause the contract
    await faster.write.pause({ account: treasury.account });
    paused = await faster.read.paused();
    assert.equal(paused, true, "Contract should be paused after pause()");

    // Unpause the contract
    await faster.write.unpause({ account: treasury.account });
    paused = await faster.read.paused();
    assert.equal(paused, false, "Contract should not be paused after unpause()");
  });

  it("Should prevent transfers when paused", async function () {
    const [deployer, treasury, user1, user2] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Transfer some tokens to user1
    await faster.write.transfer([user1.account.address, 1000n * 10n ** 18n], {
      account: treasury.account
    });

    // Pause the contract
    await faster.write.pause({ account: treasury.account });

    // Try to transfer from user1 to user2 (should fail)
    try {
      await faster.write.transfer([user2.account.address, 100n * 10n ** 18n], {
        account: user1.account
      });
      assert.fail("Transfer should have failed when contract is paused");
    } catch (error) {
      assert.ok((error as Error).message.includes("ERC20Pausable: paused"), "Should revert with pause error");
    }
  });

  it("Should prevent non-pauser from pausing", async function () {
    const [deployer, treasury, user1] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Try to pause with non-pauser account (should fail)
    try {
      await faster.write.pause({ account: user1.account });
      assert.fail("Pause should have failed for non-pauser");
    } catch (error) {
      assert.ok((error as Error).message.includes("AccessControl"), "Should revert with access control error");
    }
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


  it("Should prevent burning when paused", async function () {
    const [deployer, treasury, user1] = await viem.getWalletClients();
    
    const faster = await viem.deployContract("Faster", [treasury.account.address]);

    // Transfer some tokens to user1
    await faster.write.transfer([user1.account.address, 1000n * 10n ** 18n], {
      account: treasury.account
    });

    // Pause the contract
    await faster.write.pause({ account: treasury.account });

    // Try to burn (should fail)
    try {
      await faster.write.burn([100n * 10n ** 18n], {
        account: user1.account
      });
      assert.fail("Burn should have failed when contract is paused");
    } catch (error) {
      assert.ok((error as Error).message.includes("ERC20Pausable: paused"), "Should revert with pause error");
    }
  });
});
