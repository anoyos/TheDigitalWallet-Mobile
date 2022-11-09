const { Router } = require("express");
const Joi = require("joi")
const logger = require('../lib/logger')
const knex = require('../lib/db')
const config = require('../config')
const { authorize } = require('../lib/auth')
const coinbase = require('../lib/coinbase')
const funding = require('../lib/funding')

const router = Router();

const coinbaseChargeSchema = Joi.object().keys({
  amount: Joi.number().integer(),
  currency: Joi.string(),
})


router.post('/pay/coinbase/charge', authorize, async (req, res) => {
  const { amount, currency } = await coinbaseChargeSchema.validate(req.body);
  const name = "Buy BAL";
  const description = "Buy some tokens \\o/";

  const { aws_user_id, wallet_address } = req.currentUser
  const charge = await coinbase.createCharge({
    name,
    description,
    metadata: {
      aws_user_id,
      wallet_address,
    },
    pricing_type: "fixed_price",
    amount: amount,
    currency: currency,
  });

  const bal_amount = (amount * 100) * config.conversionRate * (10 ** 6)
  await knex('coinbase_charges').insert({
    aws_user_id: req.currentUserId,
    code: charge.data.code,
    name,
    description,
    amount,
    currency,
    bal_amount,
    json_response: JSON.stringify(charge),
  });

  res.json({
    name,
    description,
    expires_at: charge.data.expires_at,
    hosted_url: charge.data.hosted_url,
    payments: Object.entries(charge.data.addresses).map(([name, address]) => ({
      name,
      amount: charge.data.pricing[name].amount,
      currency: charge.data.pricing[name].currency,
      address,
    })),
  })
})

router.post('/pay/coinbase/webhook', async (req, res) => {
  let event = null;

  try {
    event = coinbase.verifyWebhook(
      JSON.stringify(req.body),
      req.headers['x-cc-webhook-signature'],
    );
  } catch (error) {
    logger.fmtError(error, { type: "coinbase-webhook" })
    return res.status(400).send(`Webhook Error:${error.message}`);
  }

  const chargeCode = event.event.data.code;
  const charge = await knex('coinbase_charges')
    .first()
    .where({ code: chargeCode });
  const { aws_user_id, wallet_address } = event.event.data.metadata;

  switch (event.event.type) {
    case 'charge:confirmed': {
      await knex('coinbase_charges').update({ state: 'charge:confirmed' });
      funding.mint({ aws_user_id, chargeCode, to: wallet_address, amount: charge.bal_amount })
        .then(tx => logger.info({ type: "minting", tx }))
        .catch(err => logger.fmtError(err, { type: "minting" }))
      break;
    }
    case 'charge:failed': {
      await knex('coinbase_charges').update({ state: 'charge:failed' });
      break;
    }
    default:
      return res.sendStatus(400);
  }
  res.json({ received: true })
})

module.exports = router;
