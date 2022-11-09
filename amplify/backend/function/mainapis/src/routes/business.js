const {Router} = require('express');
const Joi = require('joi');
const knex = require('../lib/db');
const {authorize} = require('../lib/auth');
const {checkTimeout} = require('../lib/timeout');

/* eslint-disable newline-per-chained-call */
const schema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    name: Joi.string(),
    description: Joi.string(),
    encrypted_key: Joi.string(),
    address: Joi.string(),
    formatted_address: Joi.string(),
    street_address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    image_url: Joi.string(),
    phone: Joi.string(),
    website_url: Joi.string().optional(),
    category_id: Joi.number().integer(),
  });

const updateSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    name: Joi.string(),
    description: Joi.string(),
    address: Joi.string(),
    formatted_address: Joi.string(),
    street_address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    image_url: Joi.string(),
    phone: Joi.string(),
    website_url: Joi.string().optional(),
    category_id: Joi.number().integer(),
  })
  .min(1);
/* eslint-enable newline-per-chained-call */

function withTable(params, table) {
  // eslint-disable-next-line no-return-assign, no-sequences, new-line-per-chained-call
  return Object.entries(params).reduce(
    (o, [k, v]) => ((o[`${table}.${k}`] = v), o),
    {},
  );
}

const router = Router();

router.get('/businesses', async (req, res) => {
  const response = await knex.select().from('businesses');
  res.json(response || []);
});

router.get('/business', authorize, async (req, res) => {
  const business = await knex('businesses')
    .select()
    .where({aws_user_id: req.currentUserId})
    .first();

  res.json(business);
});
// checkTimeout,
router.post('/businesses', authorize, async (req, res) => {
  const params = await schema.validate(req.body, {presence: 'required'});
  params.aws_user_id = req.currentUserId;
  const response = await knex('businesses').insert(params);

  res.json(response);
});

router.patch('/businesses/:id', authorize, async (req, res) => {
  const params = await updateSchema.validate(req.body);
  const result = await knex('businesses')
    .where({'businesses.id': req.params.id, aws_user_id: req.currentUserId})
    .update(withTable(params, 'businesses'));

  if (result === 0) {
    // promotion not updated, user is not owner or promotion doesnt exist
    res.status(404);
  } else {
    res.status(200);
  }
  res.json({});
});

router.get('/business/:id', async (req, res) => {
  const businessId = req.params.id;
  const response = await knex
    .select()
    .from('new_businesses')
    .where({id: businessId});
  res.json(response || {});
});

router.get('/business/:id/transactions', async (req, res) => {
  const address = req.params.id;
  const response = await knex('transactions')
    .select()
    .where({from_type: 'business', address_from: address})
    .orWhere({to_type: 'business', address_to: address});

  res.json(response);
});

module.exports = router;
