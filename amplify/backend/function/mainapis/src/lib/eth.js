const Web3 = require('web3');
const Joi = require('joi');
const logger = require('./logger');

const dbConnection = {
  host: 'database-1.cl8jcz3tpxxa.eu-west-2.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'lolG32327',
  database: 'digitall',
};
const config = {
  contractAddress: process.env.BALEHU_CONTRACT_ADDR,
  mintingAccounts: process.env.MINTING_ACCOUNTS,
  nodeAddr: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  c: dbConnection,
};

const knex = require('knex')({
  client: 'mysql2',
  connection: config.dbConnection,
});

const eventSchema = Joi.object().keys({
  aws_user_id: Joi.string().required(),
  charge_id: Joi.number().required(),
  amount: Joi.number().required(),
  to: Joi.string().required(),
  contract_address: Joi.string().required(),
});

async function mint(event) {
  try {
    logger.info({type: 'mint', message: 'start mint', event: event.to});
    const {
      aws_user_id,
      charge_id,
      amount,
      to,
      contract_address,
    } = await eventSchema.validate(event, {
      abortEarly: false,
      stripUnknown: true,
    });
    const web3 = new Web3(
      new Web3.providers.HttpProvider(config.nodeAddr),
      null,
      {transactionConfirmationBlocks: 1},
    );

    const mintingAccounts = config.mintingAccounts.map(account => ({
      address: web3.eth.accounts.privateKeyToAccount(`0x${account}`).address,
      pk: account,
    }));

    const usedAccounts = await knex('mintings')
      .pluck('minter')
      .where({tx_id: null});
    const availableAccounts = mintingAccounts.filter(
      account => !usedAccounts.includes(account.address),
    );
    if (availableAccounts.length === 0) {
      throw new Error('No available accounts');
    }

    const account = web3.eth.accounts.wallet.add(
      `0x${availableAccounts[0].pk}`,
    );
    const assetTokenJson = require('./contracts/AssetToken.json');

    const contract = new web3.eth.Contract(
      assetTokenJson.abi,
      contract_address,
      {gasPrice: '0'},
    );

    const measure = logger.measure();
    logger.info({type: 'mint', message: 'minting', to, amount});
    const mintingId = await knex('mintings').insert(
      {aws_user_id, charge_id, mint_amount: amount, minter: account.address},
      'id',
    );
    const rcpt = await contract.methods
      .mint(to, amount)
      .send({from: account.address, gas: 500000, chainId: 84626});
    logger.info({
      type: 'mint',
      message: 'minting succesful',
      measure: measure(),
      rcpt,
    });
    await knex('mintings')
      .update({tx_id: rcpt.transactionHash})
      .where({id: mintingId[0]});
    await knex('charges')
      .update({pending: false})
      .where({id: charge_id});
    const {symbol} = await knex('exchange_contracts')
      .select('symbol')
      .where({address: contract_address})
      .first();
    if (charge_id !== 999999999)
      await knex('notifications').insert({
        aws_user_id,
        message: `You have purchased ${Math.round(amount / 10 ** 4) /
          100} ${symbol}.`,
        payload: JSON.stringify({
          type: 'minting',
          amount,
          contract: contract_address,
          symbol,
        }),
      });
  } catch (err) {
    logger.fmtError(err);
  }
}

module.exports = {
  mint,
};
