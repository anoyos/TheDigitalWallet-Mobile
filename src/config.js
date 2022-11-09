import Config from 'react-native-config';

module.exports = {
  eth: {
    nodeAddress:
      'https://e0yz9pwe6h:vf2hnujPJJKD5tcKvpqk8XImvILvSzlcCEW18J_x2zE@e0f89v2ex3-e0b2kv5nv4-rpc.de0-aws.kaleido.io/', //'https://optimism.gnosischain.com', //'https://alfajores-forno.celo-testnet.org',
    ownerWalletAddress:
      '007bfa8fdfa75c4dd5cd6df2bd3f4715cff4d86a368958bdd825718affad3468',
  },
  contracts: {
    exchange: '0xC32e683c94884e49EF045ea35c6Ad8EF204826c2',
    users: '0x838805d004AA217c1b66348fE5E2F22B8a5b991D',
    digitall: '0x759aE71352595F8E3d093D6Fa7FBC9f4e3B495DC',
    refund: '0x6251Efa4920362d51666C95450D10e9Cc5e5EB41',
    assetAddresses2: [
      {name: 'USDToken', address: '0x38FAa642E2383e7C8D71D1Aa054AeDf50A920082'},
      {
        name: 'GoldToken',
        address: '0x576AB7Cf22E71D351aa88192E4fe419267dd9d76',
      },
    ],
    cryptoAssetAddresses2: [
      {
        name: 'BitcoinToken',
        address: '0xf503E0BB3Bd0f02c512551c0747f39715E82C5Dc',
      },
    ],
  },
  cognito: {
    userPoolId: Config.USER_POOL_ID,
    userPoolWebClientId: '6q09t9qvvkcraneb1dltuojab3',
    loginType: Config.COGNITO_LOGIN_TYPE,
  },
};

// module.exports = {
//   eth: {
//     nodeAddress: 'https://data-seed-prebsc-1-s1.binance.org:8545',
//     ownerWalletAddress:
//       '007bfa8fdfa75c4dd5cd6df2bd3f4715cff4d86a368958bdd825718affad3468',
//   },
//   cognito: {
//     userPoolId: Config.USER_POOL_ID,
//     userPoolWebClientId: '6q09t9qvvkcraneb1dltuojab3',
//     loginType: Config.COGNITO_LOGIN_TYPE,
//   },
// };
