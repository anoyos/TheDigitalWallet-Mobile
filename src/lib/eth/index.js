import wallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import config from 'app/config';
import {decrypt} from 'app/lib/pkey';

const assetTokenJson = require('./contracts/AssetToken.json');
const exchangeJson = require('./contracts/Exchange.json');
const usersJson = require('./contracts/Users.json');
const digitallJson = require('./contracts/Digitall.json');

// const usersAddress = '0xA073d8959C0A359724106582f28DADD41e8D5Eef';
// const usersAddress = '0xcF8fCAF05356e69C3eb70681AF1B9712baC9373d';
// const exchangeAddress = '0x8cEa0F8B9FF3A761f6aade9B705DebF22491ce50';
// const exchangeAddress = '0x07c7de069483417FfD1Ad762C912B9f2EdA8cB94';
// const refundAddress = '0x5f8f21dd9Cf6b700161F88803E5235a759023e90'
// const digitallAddress = '0x49A9F96417355B0FEA98Cc0BC12225f026C913F5'
// const digitallAddress = '0x5AC0BED0090A20B9F5F6b47CA120d90dbCe324e1';
// const zeroAddress = '0x0000000000000000000000000000000000000000'

const contracts = config.contracts;
const usersAddress = contracts.users;
const exchangeAddress = contracts.exchange;
const refundAddress = contracts.refund;
const digitallAddress = contracts.digitall;

export const addresses = {
  USD: contracts.assetAddresses2.filter(f => f.name === 'USDToken')[0].address,
  Gold: contracts.assetAddresses2.filter(f => f.name === 'GoldToken')[0]
    .address,
  BTC: contracts.cryptoAssetAddresses2.filter(f => f.name === 'BitcoinToken')[0]
    .address,
};

// export const addresses = {
//   // USD: '0xBFCc33E3ff9791420404F248B20aF32D6Ae9cb56',
//   // CAD: '0xf0157Fc09907e10C32fD223A97C486CD4b898937',
//   // AUD: '0x190d2DDfAe259F6B5e3d6E82079911E97D54b96e',
//   // CHF: '0x7649530851c684380a2510E643cd013EF145cB01',
//   // EUR: '0xfAD514D01B44F38EF2327Df7AF740ff255B3852C',
//   // GBP: '0xbAF7b6485053dA478ba4547eb227e7fB46af48B5',
//   // JPY: '0x0FEE532C40225ce4bd3CC3825bc8867705B2bE31',
//   // NOK: '0x998C7a3fAE1A078A7f4430F462e14E0Fc00602Cb',
//   // NZD: '0x47c7a83F1DEc4Df5a6789077929fC117821ffFF2',
//   // SEK: '0x4db41c8472AA88B3347c4438325bd199940f905A',
//   // Gold: '0x529AEae7F015e23A29ddd14a4345834FCcD85E90',
//   // Silver: '0xfF1D4FbEAbB23D25140c5F1eFF0754AC20E0eb2E',
//   // Platinum: '0x23737512D77335a31120c4b5659c4d5263A5732c',
//   // Oil: '0x889CBED671d7CD4Aa887F1C3b737EfB8491827EF',
//   // FTSE: '0x806497B79D21bb84Dc9B42360317AA0d7761F665',
//   // 'S&P': '0x16e212e58bCF88B85b852C6cf887BD5F8F0e8853',
//   // EURSTOXX: '0x9d641aa6A34182e7e23da3E58c44EAA8d670eBD8',
//   // //
//   // BTC: '0xd3c10FBb82C25B5d5105081E229D508cA0795f28',
//   // ETH: '0x02c1BdEcE8552358923296E48DDB84925bFCE1e9',
//   // XRP: '0x5065De85d38865877dcB4b53632bf5645225A79f',
//   // XLM: '0x7CE3C8560f46ca4a0a7Dff352C3024c01dEA6906',

//   // USD: '0x5e343eE9cBd2f12C06580a0e701e17db3C961d27',
//   // CAD: '0xa40dAA14fc0c022E5afE7720583669C2075Aa8cE',
//   // AUD: '0x975A0c1675F175d3a7425aD652AD9C828Ca0679c',
//   // CHF: '0xdE76656D5926F2c4DC95622D2CbAFB97A8D96C31',
//   // EUR: '0x9f49dC306b3Ffa0902C21989B17c8382AC300995',
//   // GBP: '0xeF3AA3BBCC8247888e2751Fe1140F5a007F7Db3b',
//   // JPY: '0x5794B1948F7D1db3E69a16e5ef76B40aCf24C774',
//   // NOK: '0x9E68B63F4E1660670cb7cAEA4ecF2AFD5caCe43E',
//   // NZD: '0xDdced09D344Fe9d7a36602cBA5f914CB37398c53',
//   // SEK: '0x3ba49470f4B01B69bF13c2d16Fb924d82500817B',
//   // Gold: '0x81F1b6Ada274f706984D1b9f39aC546e192294B7',
//   // Silver: '0x44e3Bd4F8bB28F19D98AD7c1E77b82Ce564A5641',
//   // Platinum: '0x57373868D29AC7CdD2ACAb3456Ba3E5311A69186',
//   // Oil: '0xd825Afe2959816AeB95DB8a1908802615A25E8d0',
//   // FTSE: '0x0176E87b38424B679166f6cB67f64a942D328088',
//   // 'S&P': '0xA5dd781477ac0AE7da91C694E9Ba2c7a986D1040',
//   // EURSTOXX: '0x60301d7B094Cf06d6B6908B947F987a0fD96dB15',
//   // BTC: '0xc64A646929e84af19633036b7AefD5b5d3E41235',
//   // ETH: '0x36D5455DA820349422685844F33CBB1F66087B1d',
//   // XRP: '0xAff44936aaABf2F083bBEAE87cCFB07E25021df3',
//   // LTC: '0xBF4AAdc252f47e716fedb3F56cD5fC363353aDf9',
//   // GoldBritannia: '0x0c30A0d230B48287305c064B5941586ACf7690A2',
//   // SilverBritannia: '0x8C301bA05F0B583233800b40c809889846044685',
//   // GoldSovereign: '0x2BF38E4D72A38E078353E81099AeAB1c28C20f15',
// };

export function createWallet(randomKey) {
  const ethWallet = wallet.generate(false, randomKey);
  const privateKey = ethWallet.getPrivateKeyString();
  const address = ethWallet.getAddressString();
  return [privateKey, address];
}

export default class Ethereum {
  static async create({encryptedKey, hashKey}) {
    const ethereum = new Ethereum();
    const privateKey = await decrypt(encryptedKey, hashKey);

    const provider_ = new Web3.providers.HttpProvider(config.eth.nodeAddress);
    const web3 = new Web3(provider_);
    web3.eth.accounts.wallet.add(`0x${config.eth.ownerWalletAddress}`);
    web3.eth.accounts.wallet.add(`0x${privateKey}`);

    ethereum.web3 = web3;
    ethereum.address = web3.eth.accounts.wallet[0].address; // eslint-disable-line prefer-destructuring
    ethereum.useraddress = web3.eth.accounts.wallet[1].address; // eslint-disable-line prefer-destructuring

    return ethereum;
  }

  getFlatFeeValues() {
    const digitallContract = new this.web3.eth.Contract(
      digitallJson.abi,
      digitallAddress,
      {gasPrice: 0},
    );
    return digitallContract.methods
      .getFlatFeeValues()
      .call({from: this.address});
  }

  getPurchaseWithCreditCardFeeValues() {
    const digitallContract = new this.web3.eth.Contract(
      digitallJson.abi,
      digitallAddress,
      {gasPrice: 0},
    );
    return digitallContract.methods
      .getPurchaseWithCreditCardFeeValues()
      .call({from: this.address});
  }

  getPurchaseWithCryptoFeeValues() {
    const digitallContract = new this.web3.eth.Contract(
      digitallJson.abi,
      digitallAddress,
      {gasPrice: 0},
    );
    return digitallContract.methods
      .getPurchaseWithCryptoFeeValues()
      .call({from: this.address});
  }

  getPurchaseWithEurCreditCardFeeValues() {
    const digitallContract = new this.web3.eth.Contract(
      digitallJson.abi,
      digitallAddress,
      {gasPrice: 0},
    );
    return digitallContract.methods
      .getPurchaseWithEurCreditCardFeeValues()
      .call({from: this.address});
  }

  getStorageFeeValues() {
    const digitallContract = new this.web3.eth.Contract(
      digitallJson.abi,
      digitallAddress,
      {gasPrice: 0},
    );
    return digitallContract.methods
      .getStorageFeeValues()
      .call({from: this.address});
  }

  calculateExchangeFee(userAddress, value, fromSymbol, toSymbol) {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    return exchangeContract.methods
      .calculateExchangeFee(userAddress, value, [
        addresses[fromSymbol],
        addresses[toSymbol],
      ])
      .call({from: this.address});
  }

  async createUser(isMerchant) {
    const userContract = new this.web3.eth.Contract(
      usersJson.abi,
      usersAddress,
      {gasPrice: 0},
    );
    return userContract.methods.createUser(isMerchant, this.useraddress).send({
      from: this.address,
      gas: 500000,
      chainId: '0x61',
    });
  }

  getUserId(userAddress) {
    const userContract = new this.web3.eth.Contract(
      usersJson.abi,
      usersAddress,
      {gasPrice: 0},
    );
    return userContract.methods
      .addressToUserIndex(userAddress)
      .call({from: this.address});
  }

  async isSuperUser(userAddress) {
    let isSup = false;

    const userContract = new this.web3.eth.Contract(
      usersJson.abi,
      usersAddress,
    );

    const res = userContract.methods
      .isSuperUser(userAddress)
      .call({from: this.useraddress});

    return res.data ? res.data : isSup;
  }

  getExchangeFeeScalar(userAddress, fromSymbol, toSymbol) {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    return exchangeContract.methods
      .feeScalar(userAddress, [addresses[fromSymbol], addresses[toSymbol]])
      .call({from: this.address});
  }

  async getCryptoExchangeFeeValues() {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    const numerator = await exchangeContract.methods
      .cryptoExchangeFeeValues(0)
      .call({from: this.address});
    const denominator = await exchangeContract.methods
      .cryptoExchangeFeeValues(1)
      .call({from: this.address});

    return parseFloat(numerator / denominator);
  }

  async getPriceModifiers() {
    const priceModifiers = {};
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );

    // eslint-disable-next-line no-unused-vars
    for (const [symbol, contractAddress] of Object.entries(addresses)) {
      const numerator = await exchangeContract.methods
        .priceModifiers(contractAddress, 0)
        .call({from: this.address});
      const denominator = await exchangeContract.methods
        .priceModifiers(contractAddress, 1)
        .call({from: this.address});

      priceModifiers[symbol] = parseFloat(numerator / denominator);
    }

    return priceModifiers;
  }

  async getTransactionFeeValues(userAddress) {
    try {
      const userContract = new this.web3.eth.Contract(
        usersJson.abi,
        usersAddress,
      );

      const res = userContract.methods
        .getTransactionFeeValues(userAddress)
        .call({from: this.userAddress});

      return res.data ? res.data : false;
    } catch (error) {
      return false;
    }
  }

  getRemainingFreeTransactions(userAddress) {
    try {
      const userContract = new this.web3.eth.Contract(
        usersJson.abi,
        usersAddress,
      );

      const res = userContract.methods
        .getRemainingFreeTransactions(userAddress)
        .call({from: this.userAddress});

      return res.data ? res.data : false;
    } catch (error) {
      return false;
    }
  }

  getReferrerAddress(userAddress) {
    try {
      const userContract = new this.web3.eth.Contract(
        usersJson.abi,
        usersAddress,
      );

      const res = userContract.methods
        .getReferrerAddress(userAddress)
        .call({from: this.userAddress});

      return res.data ? res.data : false;
    } catch (error) {
      return false;
    }
  }

  getExchangeFeeValues(userAddress) {
    try {
      const userContract = new this.web3.eth.Contract(
        usersJson.abi,
        usersAddress,
      );
      const res = userContract.methods
        .getExchangeFeeValues(userAddress)
        .call({from: this.userAddress});

      return res.data ? res.data : false;
    } catch (error) {
      return false;
    }
  }

  getNonce() {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    return exchangeContract.methods.getNonce().call({from: this.address});
  }

  approve(address, amount) {
    const assetContract = new this.web3.eth.Contract(
      assetTokenJson.abi,
      address,
      {gasPrice: 0},
    );
    return assetContract.methods
      .approve(exchangeAddress, amount)
      .send({from: this.address, gas: 500000, chainId: 84626});
  }

  exchange(exchangeValues, addressValues, sig) {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    return exchangeContract.methods
      .exchange(exchangeValues, addressValues, sig)
      .send({from: this.address, gas: 500000, chainId: 84626});
  }

  exchangeAndTransfer(exchangeValues, addressValues, recipient, sig, salt) {
    const exchangeContract = new this.web3.eth.Contract(
      exchangeJson.abi,
      exchangeAddress,
      {gasPrice: 0},
    );
    return exchangeContract.methods
      .exchangeAndTransfer(exchangeValues, addressValues, recipient, sig, salt)
      .send({from: this.address, gas: 500000, chainId: 84626});
  }

  // xyz2
  async getBalance(symbol) {
    if (addresses[symbol]) {
      const assetContract = new this.web3.eth.Contract(
        assetTokenJson.abi,
        addresses[symbol],
      );
      const balance = await assetContract.methods
        .balanceOf(this.useraddress)
        .call({from: this.useraddress});

      return balance;
    } else {
      return 0;
    }
  }

  async cashOut(amount, symbol) {
    try {
      const assetContract = new this.web3.eth.Contract(
        assetTokenJson.abi,
        addresses[symbol],
      );
      assetContract.methods
        .cashOut(amount * 10 ** 6)
        .send({from: this.address, gas: 500000})
        .once('transactionHash', hash => {
          console.log(hash);
        })
        .once('receipt', async receipt => {
          console.log(receipt);

          return receipt;
        })
        .catch(function(e) {
          console.log('sending error', e);
          return {error: true};
        });
    } catch (error) {
      console.log(error);
      return {error: true};
    }

    // const assetContract = new this.web3.eth.Contract(assetTokenJson.abi, addresses[symbol]);
    // return assetContract.methods.cashOut(amount * 10 ** 6).send({ from: this.address, gas: 500000, chainId: 84626 });
  }

  digitallTransfer(toAddress, amount, salt, symbol) {
    const assetContract = new this.web3.eth.Contract(
      assetTokenJson.abi,
      addresses[symbol],
      {gasPrice: 0},
    );
    return assetContract.methods
      .digitallTransfer(toAddress, amount * 10 ** 6, salt)
      .send({from: this.address, gas: 500000, chainId: 84626});
  }

  deposit(amount, symbol) {
    try {
      const assetContract = new this.web3.eth.Contract(
        assetTokenJson.abi,
        addresses[symbol],
      );

      assetContract.methods
        .mint(this.useraddress, `${amount * 10 ** 6}`)
        .send({from: this.address, gas: 500000})
        .once('transactionHash', hash => {
          console.log(hash);
        })
        .once('receipt', async receipt => {
          console.log(receipt);

          return receipt;
        })
        .catch(function(e) {
          console.log('sending error', e);
          return {error: true};
        });
    } catch (error) {
      console.log(error);
      return {error: true};
    }

    // const assetContract = new this.web3.eth.Contract(assetTokenJson.abi, addresses[symbol]);
    // return assetContract.methods
    //   .mint(addresses[symbol], amount * 10 ** 6)
    //   .send({ from: this.address, gas: 500000, chainId: 84626 });
  }

  buyGiftCard(amount, symbol) {
    const assetContract = new this.web3.eth.Contract(
      assetTokenJson.abi,
      addresses[symbol],
      {gasPrice: 0},
    );
    return assetContract.methods
      .cashOut(amount * 10 ** 6)
      .send({from: this.address, gas: 500000, chainId: 84626});
  }

  async contractBalance(symbol) {
    const assetContract = new this.web3.eth.Contract(
      assetTokenJson.abi,
      addresses[symbol],
    );
    const balance = await assetContract.methods
      .balanceOf(this.useraddress)
      .call({from: this.useraddress});

    return balance;
    // const assetContract = new this.web3.eth.Contract(assetTokenJson.abi, addresses[symbol], { gasPrice: 0 });
    // return assetContract.methods.balanceOf(addresses[symbol]).call({ from: this.address });
  }
}
