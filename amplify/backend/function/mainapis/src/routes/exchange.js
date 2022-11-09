const { Router } = require("express");
const Joi = require("joi")
const EthCrypto = require('eth-crypto');
const config = require('../config')
const { checkTimeout } = require('../lib/timeout')
const { authorize } = require('../lib/auth')
const knex = require('../lib/db')
const { fetchExchangedAmount, getContractAddresses } = require('../lib/exchange')

const router = Router();

const rateSchema = Joi.object().keys({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number().required(), // eslint-disable-line newline-per-chained-call
  nonce: Joi.number().integer().required(), // eslint-disable-line newline-per-chained-call
})

const exchangeSchema = Joi.object().keys({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number().optional(),
})

router.post("/exchange/convert", authorize, async (req, res) => {
  const { from, to, amount } = await exchangeSchema.validate(req.body)
  const toAmount = await fetchExchangedAmount(from, to, amount)

  res.json({ amount: toAmount })
})

router.post("/exchange/rate", authorize, async (req, res) => {
  const { from, to } = await exchangeSchema.validate(req.body);
  const pair = `${from}/${to}`

  // const rateResponse = await knex('rates')
  //   .select(pair)
  //   .where({ id: 1 })
  //   .first()

  // const rate = parseFloat(rateResponse[pair])
  const rateResponse = await knex('rates2')
    .first('value')
    .where({ name: pair })

  const rate = parseFloat(rateResponse.value)

  res.json({ rate })
})

router.post("/exchange", authorize, checkTimeout, async (req, res) => {
  const { from: fromSymbol, to: toSymbol, amount: fromAmount, nonce } = await rateSchema.validate(req.body);
  const [fromAddress, toAddress] = await getContractAddresses(fromSymbol, toSymbol);
  const toAmount = await fetchExchangedAmount(fromSymbol, toSymbol, fromAmount);
  // take out 1.5% and convert to unint256 for contract
  const formattedToAmount = Math.round(toAmount * (65 / 66) * (10 ** 6))
  const formattedFromAmount = Math.round(fromAmount * (10 ** 6))

  if (!toAmount) {
    throw new Error("Exchange amount could not be determined.");
  }

  const message = EthCrypto.hash.keccak256([
    { type: "uint256", value: formattedFromAmount },
    { type: "uint256", value: formattedToAmount },
    { type: "address", value: fromAddress },
    { type: "address", value: toAddress },
    { type: "uint256", value: nonce },
  ]);

  const sig = EthCrypto.sign(config.eth.signingKey, message);

  res.json(
    {
      exchange_params: {
        fromAmount: formattedFromAmount,
        toAmount: formattedToAmount,
        fromAddress,
        toAddress,
        nonce,
        sig,
      },
      fee: Math.round((toAmount / 66) * (10 ** 6)),
    }
  );
});

module.exports = router;
