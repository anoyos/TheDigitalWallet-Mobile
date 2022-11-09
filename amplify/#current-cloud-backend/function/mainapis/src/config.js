/* eslint-disable no-process-env */
try {
  require('dotenv').config();
} catch (e) {
  // noop
}

module.exports = {
  dbConnection: process.env.DB_CONNECTION,
  loginTimeout: parseInt(process.env.LOGIN_TIMEOUT, 10) || 15 * 60 * 1000, // 15 minutes
  awsS3Config: {
    signatureVersion: 'v4',
    accessKeyId: process.env.S3_UPLOAD_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_UPLOAD_AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_UPLOAD_AWS_REGION,
  },
  uploadS3Bucket: process.env.S3_UPLOAD_AWS_BUCKET,
  stripeApiKey:
    'pk_test_51H3JftDCORTl8KZUXZjgCEcd1x3y4ZJvcaksWwvYOkblf34wnrBGxfgu75EZb179Aadx4XYgE7gJN62aZ0LqeCJm00U5gQf5eX',
  stripeSigningSecret:
    'sk_test_51H3JftDCORTl8KZUNU2uTmFDDlDjHCgvw9WoaRN8kdtcjHuzyluTBjM4jlk8HfcxnGCbips0iW4XvKgXoz1GEtKC00EzbSuN8b',
  coinbaseApiKey: process.env.COINBASE_API_KEY,
  eth: {
    nodeAddr: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    contractOwnerKey: process.env.BALEHU_OWNER_PRIVATE_KEY,
    contractAddress: process.env.BALEHU_CONTRACT_ADDR, //
    mintingLambdaArn: process.env.MINTING_LAMBDA_ARN,
    signingKey: process.env.SIGNING_KEY, //
  },
  conversionRate: parseFloat(process.env.CONVERSION_RATE) || 1,
  congitoUserPoolId: 'eu-west-2_Gl0noybEd',
  groups: {
    admin: 'admin',
  },
  // xe: {
  //   apiKey: process.env.EX_API_KEY,
  //   id: process.env.EX_ID,
  // },
  // ig: {
  //   apiKey: process.env.IG_API_KEY,
  //   username: process.env.IG_USERNAME,
  //   password: process.env.IG_PASSWORD,
  // },
};
