const { Router } = require("express");
const Joi = require("joi")
const config = require('../config')
const knex = require('../lib/db')
const { authorize, fetchUser } = require('../lib/auth')

const router = Router();

router.post('/pay/crypto', authorize, async (req, res) => {
  const schema = Joi.object().keys({
    amount: Joi.string(),
    currency: Joi.string(),
  })
  const params = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })

  let code = null;
  for (let unique = false; !unique;) {
    code = Math.floor(1000 + (Math.random() * 9000))
    const res = await knex("crypto_charges") // eslint-disable-line no-await-in-loop
      .first(knex.raw("1"))
      .where({ code })
      .where("expires_at", ">", knex.fn.now())
    unique = !res
  }

  if (code === null) {
    throw new Error("Code couldnt be generated");
  }

  const currencyToBal = amount => parseInt((amount / 100) * config.conversionRate * (10 ** 6), 10)

  const getRate = () => 0.0048
  const convert = (amount, rate) => (amount * rate) * (10 ** 18) // eth to wei
  const addCodeToAmount = (ethAmount, code) => ethAmount + code
  const hourFromNow = () => {
    const d = new Date();
    d.setTime(d.getTime() + (60 * 60 * 1000));
    return d;
  }

  const balAmount = currencyToBal(params.amount, params.currency)
  const chargeAmount = addCodeToAmount(convert(parseInt(params.amount, 10), getRate()), code)

  const expiresAt = hourFromNow()
  const charge = {
    aws_user_id: req.currentUserId,
    code,
    expires_at: expiresAt, // knex.raw('date_add(?, INTERVAL ? MINUTE)', [knex.fn.now(), 60]),
    amount: params.amount,
    bal_amount: balAmount,
    state: "pending",
  }
  const chargeRes = await knex('crypto_charges').insert(charge, "id")
  charge.id = chargeRes[0]

  const response = {
    charge,
    prices: {
      ethereum: {
        amount: chargeAmount,
        rate: getRate("ethereum"),
        address: config.payments_eth_account,
        uri: `ethereum://${config.payments_eth_account}?value=${chargeAmount}`
      }
    }
  }
  res.json(response);
})

module.exports = router;
