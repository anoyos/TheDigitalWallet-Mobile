const { Router } = require("express");
const Joi = require("joi")
const knex = require('../lib/db')
const logger = require('../lib/logger')
const { authorize } = require('../lib/auth')
const { listUsers } = require("../lib/cognito")
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

/* eslint-disable newline-per-chained-call */
const referralSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    referred_email: Joi.string().required(),
    message: Joi.string().optional(),
  })

const updateReferralSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    id: Joi.number().required(),
  })
/* eslint-enable newline-per-chained-call */

const router = Router();

router.post('/referrals/create', authorize, async (req, res) => {
  const user = req.currentUser
  const { referred_email, message } = await referralSchema.validate(req.body)

  // Check to see if referred_email has already accepted an invite.
  const accpeted = await knex('referrals')
    .select()
    .where({ referred_email, accepted: true })
    .first()
  if (accpeted) {
    res.status(403)
    res.json({ error: { message: 'That email was referred by another user.' } })
    return
  }

  // Make sure a user doesn't enter the same invite twice.
  const duplicate = await knex('referrals')
    .select()
    .where({ referrer_email: user.email, referred_email })
    .first()
  if (duplicate) {
    res.status(403)
    res.json({ error: { message: 'Attempting to enter duplicate referral.' } })
    return
  }

  try {
    await knex('referrals').insert({
      referrer_email: user.email,
      pending: true,
      referred_email,
      referrer_name: user.name,
      created_at: new Date(),
    })
    const emailParams = {
      Destination: {
        ToAddresses: [referred_email],
      },
      Message: {
        Body: {
          Text: {
           Charset: "UTF-8",
           Data: `Come join the Digitall community by downloading the app. \n message: ${message}`
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: `${user.name} has invited you to join Digitall!`
         }
        },
      Source: 'andymalkin@gmail.com',
    };

    const publishEmailPromise = new AWS.SES({ apiVersion: '2010-12-01' })
      .sendEmail(emailParams)
      .promise()

    await publishEmailPromise
    logger.info({ message: "Invite email sent." })

    res.sendStatus(200)
  } catch (err) {
    logger.info({ type: 'error', message: err.message })
    res.sendStatus(500)
  }
})

router.get('/referrals/is-referred', authorize, async (req, res) => {
  const user = req.currentUser

  const result = await knex('referrals')
    .select()
    .where({ referred_email: user.email, pending: true })
    .first()

  if (result) {
    res.status(200)
    res.json({ referred: true, referrer_email: result.referrer_email })
  } else {
    res.status(200)
    res.json({ referred: false })
  }
})

router.get('/referrals', authorize, async (req, res) => {
  const user = req.currentUser

  const result = await knex('referrals')
    .select()
    .where({ referrer_email: user.email })

  res.json(result)
})

router.get('/referrals/pending', authorize, async (req, res) => {
  const user = req.currentUser

  const result = await knex('referrals')
    .select()
    .where({ referred_email: user.email, pending: true })

  res.json(result)
})

router.post('/referrals/accept', authorize, async (req, res) => {
  const user = req.currentUser
  const { id } = await updateReferralSchema.validate(req.body)

  await knex('referrals')
    .update({ pending: false, accepted: true })
    .where({ id })

  // Get the above referral to send a notification to sender
  const { referrer_email } = await knex('referrals')
    .select()
    .where({ id })
    .first()

  // Insert sender notification
  const sender = await listUsers(`email="${referrer_email}"`)
  if (sender.length > 0) {
    await knex("notifications").insert({
      aws_user_id: sender[0].Username,
      message: `${user.email} has accepted your referral.`,
      payload: JSON.stringify({
        type: "accept-referral",
        referrer_emai: referrer_email,
        referred_email: user.email,
      })
    });
  }

  res.sendStatus(200)
})

router.post('/referrals/decline', authorize, async (req, res) => {
  const user = req.currentUser
  const { id } = await updateReferralSchema.validate(req.body)

  await knex('referrals')
    .update({ pending: false, accepted: false })
    .where({ id })

  // Get the above referral to send a notification to sender
  const { referrer_email } = await knex('referrals')
    .select()
    .where({ id })
    .first()

  // Insert sender notification
  const sender = await listUsers(`email="${referrer_email}"`)
  if (sender.length > 0) {
    await knex("notifications").insert({
      aws_user_id: sender[0].Username,
      message: `${user.email} has declined your referral.`,
      payload: JSON.stringify({
        type: "decline-referral",
        referrer_emai: referrer_email,
        referred_email: user.email,
      })
    });
  }
  res.sendStatus(200)
})

module.exports = router;
