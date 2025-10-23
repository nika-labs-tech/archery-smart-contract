# 🚀 Deploy Faster Token to Sei Mainnet

## 📋 Prerequisites

1. **Node.js** and **npm** installed
2. **Hardhat** project setup
3. **Sei wallet** with SEI tokens for gas fees
4. **Treasury address** (multi-sig recommended)

## 🔧 Setup Environment Variables

Create a `.env` file in the project root:

```bash
# Sei Mainnet Configuration
SEI_PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=your_treasury_address_here
```

## 🛠️ Pre-deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contract
```bash
npx hardhat compile
```

### 3. Run Tests
```bash
npx hardhat test
```

### 4. Test on Sei Testnet (Optional)
```bash
# Deploy to testnet first
npx hardhat ignition deploy ignition/modules/Faster.ts --network sei-testnet
```

## 🚀 Deploy to Sei Mainnet

### Method 1: Using Custom Script
```bash
npx hardhat run scripts/deploy-faster.ts --network sei
```

### Method 2: Using Ignition
```bash
npx hardhat ignition deploy ignition/modules/Faster.ts --network sei --parameters '{"FasterModule": {"treasury": "0xYourTreasuryAddress"}}'
```

## 📊 Contract Details

- **Name**: Archer Hunter
- **Symbol**: FASTER
- **Decimals**: 18
- **Total Supply**: 1,500,000,000 FASTER
- **Features**: Pausable, Burnable, ERC20Permit

## 🔐 Security Notes

1. **Treasury Address**: Use a multi-sig wallet for maximum security
2. **Private Key**: Never commit private keys to version control
3. **Gas Fees**: Ensure sufficient SEI for deployment (~0.1 SEI)
4. **Verification**: Verify contract on Sei Explorer after deployment

## 📝 Post-deployment Checklist

- [ ] Contract deployed successfully
- [ ] Treasury has all 1.5B tokens
- [ ] Roles configured correctly
- [ ] Contract verified on explorer
- [ ] Test basic functions (transfer, burn, pause)
- [ ] Update frontend with contract address
- [ ] Announce to community

## 🌐 Useful Links

- **Sei Explorer**: https://seitrace.com
- **Sei RPC**: https://evm-rpc.sei-apis.com
- **Chain ID**: 1329
- **Currency**: SEI

## ⚠️ Important Warnings

1. **Test thoroughly** on testnet before mainnet
2. **Double-check** treasury address before deployment
3. **Keep private keys secure** and never share them
4. **Monitor** contract after deployment for any issues
