# Faster Token Smart Contract

This project contains the Faster (FASTER) ERC20 token smart contract built with Hardhat 3 Beta, featuring pause functionality, role-based access control, and permit support.

## Contract Overview

The Faster contract is an ERC20 token with the following features:

- **Token Details**: "Archer Hunter" (FASTER) with 18 decimals
- **Fixed Supply**: 1.5 billion tokens minted to treasury on deployment
- **Pause Functionality**: Can be paused/unpaused by authorized accounts
- **Role-Based Access Control**: Uses OpenZeppelin's AccessControl for permissions
- **ERC20Permit**: Supports gasless approvals via EIP-2612
- **Security**: Deployer admin rights are revoked after deployment

## Project Structure

This project includes:

- A Hardhat configuration file optimized for the Faster contract
- Foundry-compatible Solidity unit tests
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html) and [`viem`](https://viem.sh/)
- Ignition deployment module for the Faster contract
- Examples demonstrating network connections including OP mainnet simulation

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Faster.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Faster.ts
```

### Deployment Parameters

The Faster contract requires a treasury address parameter during deployment. You can specify this using:

```shell
npx hardhat ignition deploy ignition/modules/Faster.ts --parameters '{"FasterModule": {"treasury": "0xYourTreasuryAddress"}}'
```
