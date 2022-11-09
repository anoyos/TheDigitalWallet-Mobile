const { Router } = require("express");
const Joi = require("joi")
const { listUsers } = require("../lib/cognito")
const knex = require('../lib/db')
const logger = require('../lib/logger')
const { authorize } = require('../lib/auth')
const funding = require('../lib/funding')
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

/* eslint-disable newline-per-chained-call */
const createPendingSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    receiver_email: Joi.string(),
    receiver_message: Joi.string().optional(),
    type: Joi.string().optional(),
    amount: Joi.number(),
    symbol: Joi.string(),
  })

const createSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    receiver_email: Joi.string(),
    receiver_message: Joi.string().optional(),
    type: Joi.string().optional(),
    amount: Joi.number(),
    symbol: Joi.string(),
    aws_user_id: Joi.string(),
  })

const acceptSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    id: Joi.number(),
  })
/* eslint-enable newline-per-chained-call */

const router = Router();

router.post('/gift-cards/create-pending', authorize, async (req, res) => {
  const user = req.currentUser
  const { receiver_email, amount, symbol, receiver_message, type } = await createPendingSchema.validate(req.body)

  const emailParams = {
    Destination: {
      ToAddresses: [receiver_email],
    },
    Message: {
      Body: {
        Text: {
         Charset: "UTF-8",
         Data: "Download the app and create an accout with this email to redeem your gift card!",
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: `${user.name} has sent you a gift of ${amount} ${symbol} in the Digitall app!`
       }
      },
    Source: 'andymalkin@gmail.com',
  };

  await knex('gift_cards').insert({
    sender_email: user.email,
    pending: true,
    receiver_email,
    receiver_message,
    type,
    amount: amount * (10 ** 6),
    symbol,
    created_at: new Date(),
  })

  await knex('notifications').insert({
    aws_user_id: req.currentUserId,
    message: `You have purchased a gift card for ${receiver_email} for ${amount} ${symbol}.`,
    payload: JSON.stringify({
      type: "gift-card",
      receiver_email,
      sender_email: user.email,
    })
  })

  const publishEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(emailParams)
    .promise()

  await publishEmailPromise

  res.sendStatus(200)
})

router.post('/gift-cards/create', authorize, async (req, res) => {
  const user = req.currentUser
  const { receiver_email, amount, symbol, aws_user_id, receiver_message, type } = await createSchema.validate(req.body)

  const emailParams = {
    Destination: {
      ToAddresses: [receiver_email],
    },
    Message: {
      Body: {
        Text: {
         Charset: "UTF-8",
         Data: "Open the Digitall app to redeem your gift card!",
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: `${user.name} has sent you a gift of ${amount} ${symbol} in the Digitall app!`
       }
      },
    Source: 'andymalkin@gmail.com',
  };

  await knex('gift_cards').insert({
    sender_email: user.email,
    pending: false,
    receiver_email,
    receiver_message,
    type,
    amount: amount * (10 ** 6),
    symbol,
    created_at: new Date(),
  })

  await knex('notifications').insert({
    aws_user_id,
    message: `${user.name} sent you a gift card for ${amount} ${symbol}.`,
    payload: JSON.stringify({
      type: "gift-card",
      receiver_email,
      sender_email: user.email,
    })
  })

  const publishEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' })
    .sendEmail(emailParams)
    .promise()

  await publishEmailPromise

  res.sendStatus(200)
})

router.get('/gift-cards/pending', authorize, async (req, res) => {
  const user = req.currentUser

  const results = await knex('gift_cards')
    .select()
    .where({ receiver_email: user.email, pending: true })

  res.status(200)
  res.json({ pending: results })
})

router.get('/gift-cards/accepted', authorize, async (req, res) => {
  const user = req.currentUser

  const results = await knex('gift_cards')
    .select()
    .where({ receiver_email: user.email, pending: false })

  res.status(200)
  res.json({ accepted: results })
})

router.post('/gift-cards/accept', authorize, async (req, res) => {
  const user = req.currentUser
  const { id } = await acceptSchema.validate(req.body, { presence: 'required' })

  const result = await knex('gift_cards')
    .select()
    .where({ id })
    .first()

  if (!result.pending) {
    res.sendStatus(400)
    return
  }

  if (result.receiver_email !== user.email) {
    res.sendStatus(403)
    return
  }

  const { sender_email, amount, symbol } = result
  const { address: contract_address } = await knex('exchange_contracts')
    .select('address')
    .where('symbol', symbol)
    .first()

  try {
    await funding.mint({
      aws_user_id: req.currentUserId,
      charge_id: 999999999,
      to: user.wallet_address,
      amount,
      contract_address
    })
  } catch (err) {
    logger.fmtError(err, { type: 'minting' })
  }

  await knex('gift_cards')
    .update({ pending: false })
    .where({ id })

  // Insert receiver notification
  await knex("notifications").insert({
    aws_user_id: req.currentUserId,
    message: `You have accepted a gift card from ${sender_email} for ${amount / (10 ** 6)} ${symbol}.`,
    payload: JSON.stringify({
      type: "gift-card",
      amount,
      symbol,
      sender_email,
      receiver_email: user.email,
    })
  });

  // Insert sender notification
  const sender = await listUsers(`email="${sender_email}"`)
  if (sender.length > 0) {
    await knex("notifications").insert({
      aws_user_id: sender[0].Username,
      message: `${user.email} has accpeted your gift card for ${amount / (10 ** 6)} ${symbol}.`,
      payload: JSON.stringify({
        type: "gift-card",
        amount,
        symbol,
        sender_email,
        receiver_email: user.email,
      })
    });
  }

  res.sendStatus(200)
})

module.exports = router;
