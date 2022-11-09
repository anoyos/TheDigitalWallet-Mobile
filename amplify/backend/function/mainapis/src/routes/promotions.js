const { Router } = require("express");
const Joi = require('joi')
const knex = require('../lib/db')
const { authorize } = require('../lib/auth')
const funding = require('../lib/funding')
const logger = require('../lib/logger')
const { checkTimeout } = require('../lib/timeout')
const { updateUser } = require('../lib/cognito')

const router = Router();

/* eslint-disable newline-per-chained-call */
const schema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true
  }).keys({
    business_id: Joi.number().integer().required(),
    name: Joi.string(),
    description: Joi.string(),
    image_url: Joi.string(),
    amount_original: Joi.number().integer().optional(),
    amount_discount: Joi.number().integer().optional(),
    amount_facevalue: Joi.number().integer().optional(),
    use_count_remaining: Joi.number().integer().optional(),
    expire_at: Joi.date().optional(),
    sku: Joi.string().optional(),
    active: Joi.boolean(),
    required_spent_amount: Joi.number().integer().optional(),
    type: Joi.string().valid(['offer', 'loyalty', 'announcement', 'bogo', 'discount', 'cash_back', 'sign_up', 'referral']),
  })

const updateSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    name: Joi.string(),
    description: Joi.string(),
    image_url: Joi.string(),
    use_count_remaining: Joi.number().integer(),
    expire_at: Joi.date(),
    active: Joi.boolean(),
    required_spent_amount: Joi.number().integer(),
  }).min(1)

const redeemSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    promotion_id: Joi.number().required(),
  })

const confirmRedeemSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  }).keys({
    transaction_id: Joi.string().required(),
  })
/* eslint-enable newline-per-chained-call */

function withTable(params, table) { // eslint-disable-next-line no-return-assign, no-sequences, new-line-per-chained-call
  return Object.entries(params).reduce((o, [k, v]) => (o[`${table}.${k}`] = v, o), {})
}

router.post('/promotions', authorize, checkTimeout, async (req, res) => {
  // get business id from userId, not from params - anyone can set any id they want
  const params = await schema.validate(req.body, { presence: 'required' })
  const response = await knex('promotions').insert(params, 'id')
  res.status(201)
  res.json({ id: response[0] })
})

router.patch('/promotions/:id', authorize, checkTimeout, async (req, res) => {
  const params = await updateSchema.validate(req.body)
  const result = await knex('promotions')
    .join('businesses', { 'promotions.business_id': 'businesses.id' })
    .where({ 'promotions.id': req.params.id, 'businesses.aws_user_id': req.currentUserId })
    .update(withTable(params, 'promotions'))

  if (result === 0) {
    // promotion not updated, user is not owner or promotion doesnt exist
    res.status(404)
  } else {
    res.status(200)
  }
  res.json({})
})

router.delete('/promotions/:id', authorize, checkTimeout, async (req, res) => {
  const result = await knex('promotions')
    .where('id', req.params.id)
    .whereIn('business_id', function() {
      this.select('id')
          .from('businesses')
          .where('aws_user_id', req.currentUserId);
    })
    .del()

  if (result === 0) {
    // promotion not updated, user is not owner or promotion doesnt exist
    res.status(404)
  } else {
    res.status(201)
  }
  res.json({})
})

router.get('/promotions', async (req, res) => {
  const response = await knex('promotions')
    .join('businesses', { 'promotions.business_id': 'businesses.id' })
    .select('promotions.*', 'businesses.latitude', 'businesses.longitude', 'businesses.name AS businessName')
  res.json(response)
})

router.get('/promotions/business/:businessId', authorize, async (req, res) => {
  const response = await knex('promotions')
    .select()
    .where({ business_id: req.params.businessId })
  res.json(response)
})

router.post('/promotions/redeem/referral', authorize, checkTimeout, async (req, res) => {
  const { promotion_id } = await redeemSchema.validate(req.body)
  const tx = await new Promise(resolve => {
    knex.transaction(transaction => {
      resolve(transaction);
    });
  });

  const promotion = await tx('promotions')
    .where({ id: promotion_id })
    .first()
  if (!promotion) {
    res.status(404)
    res.json({})
    await tx.commit()
    return
  }
  if (promotion.type !== 'referral') {
    res.status(403)
    res.json({ errors: [{ message: 'User attempted to redeem an non-referral promotion.' }] })
    await tx.commit()
    return
  }

  const { available_referrals } = req.currentUser
  if (available_referrals < promotion.amount_facevalue) {
    res.status(403)
    res.json({ errors: [{ message: 'User does not have enough referrals.' }] })
    await tx.commit()
    return
  }

  await tx('redemptions').insert({
    promotion_id,
    aws_user_id: req.currentUserId
  })

  await tx('users')
    .update({ available_referrals: available_referrals - promotion.amount_facevalue })
    .where({ aws_user_id: req.currentUserId })
  await updateUser(req.currentUser, { "custom:available_referrals": available_referrals })

  await tx('promotions')
    .update({ amount_used: promotion.amount_used + 1 })
    .where({ id: promotion.id })


  funding.mint({
    aws_user_id: req.currentUserId,
    charge_id: 0,
    to: req.currentUser.wallet_address,
    amount: promotion.mint_bal_amount
  })
    .then(tx => logger.info({ type: "minting", tx }))
    .catch(err => logger.fmtError(err, { type: "minting" }))
  await tx.commit()
  res.status(200)
  res.json({})
})

router.post('/promotions/redeem/offer', authorize, checkTimeout, async (req, res) => {
  const { promotion_id } = await redeemSchema.validate(req.body)
  const tx = await new Promise(resolve => {
    knex.transaction(transaction => {
      resolve(transaction);
    });
  });

  const promotion = await tx('promotions')
    .where({ id: promotion_id })
    .first()

  if (!promotion) {
    res.status(404)
    res.json({})
    await tx.commit()
    return
  }

  if (promotion.use_count_remaining === 0) {
    res.status(403)
    res.json({ errors: [{ type: 'use_count_remaining_0' }] })
    await tx.commit()
    return
  }

  await tx('redemptions')
    .insert({
      promotion_id: promotion.id,
      aws_user_id: req.currentUserId,
    })
  if (promotion.use_count_remaining > 0) {
    await tx('promotions')
      .update({ use_count_remaining: promotion.use_count_remaining - 1, amount_used: promotion.amount_used + 1 })
      .where({ id: promotion_id })
  }

  await tx.commit()
  res.status(200)
  res.json({})
})

router.post('/promotions/:id/confirm_redeem', authorize, checkTimeout, async (req, res) => {
  const { transaction_id } = await confirmRedeemSchema.validate(req.body)
  const promotion = await knex('promotions')
    .where({ id: req.params.id })
    .first()
  if (!promotion) {
    res.status(404)
    res.json({})
    return
  }
  if (promotion.use_count_remaining === 0) {
    res.status(403)
    res.json({})
    return
  }

  const redemption = await knex('redemptions')
    .where({ promotion_id: req.params.id, aws_user_id: req.currentUserId })
    .first()
  if (!redemption) {
    res.status(404)
    res.json({})
    return
  }

  await knex('redemptions')
    .where({ id: redemption.id })
    .update({ transaction_id })

  if (promotion.use_count_remaining > 0) {
    await knex('promotions')
      .update({ use_count_remaining: promotion.use_count_remaining - 1 })
      .where({ id: promotion.id })
  }

  res.status(200)
  res.json({})
})

module.exports = router;
