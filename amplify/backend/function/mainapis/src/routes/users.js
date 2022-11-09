const {Router} = require('express');
const Joi = require('joi');
const Eth = require('web3-eth');
const config = require('../config');
const knex = require('../lib/db');
const logger = require('../lib/logger');
const {authorize} = require('../lib/auth');
const {checkTimeout, touch} = require('../lib/timeout');
const {retrieveOrCreateCustomer} = require('../lib/stripe');
const {listUsers, addUserToAdminGroup} = require('../lib/cognito');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

/* eslint-disable newline-per-chained-call */
const updateSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    pin: Joi.string(),
    encrypted_key: Joi.string().hex(),
    address: Joi.string(),
  })
  .min(1);

const kycUpdateSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    pin: Joi.string(),
    bill_image_url: Joi.string(),
    passport_image_url: Joi.string(),
    phone: Joi.string(),
  })
  .min(1);

const kycSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    bill_image_url: Joi.string(),
    passport_image_url: Joi.string(),
    phone: Joi.string(),
    country_code: Joi.string(),
  });

const friendSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    friend: Joi.string().required(),
  });
/* eslint-enable newline-per-chained-call */

const router = Router();

router.get('/user/info/:email', authorize, async (req, res) => {
  let user = null;
  const email = req.params.email;

  const cognitoUsers = await listUsers(`email="${email}"`);

  if (cognitoUsers.length > 0) user = cognitoUsers[0];

  res.status(200);
  res.json({user});
});

router.post('/user/friend', authorize, async (req, res) => {
  const {friend} = await friendSchema.validate(req.body);
  const aws_user_id = req.currentUserId;

  const duplicate = await knex('friends')
    .select()
    .where({aws_user_id: req.currentUserId, friend})
    .first();

  if (duplicate) res.status(403).send('Duplicate friend');
  else {
    await knex('friends').insert({aws_user_id, friend});
    res.sendStatus(200);
  }
});

router.get('/user/friends', authorize, async (req, res) => {
  const aws_user_id = req.currentUserId;
  const friends = await knex('friends')
    .select('friend')
    .where({aws_user_id});

  res.json(friends);
});

router.get('/user', authorize, async (req, res) => {
  const user = req.currentUser;
  const businesses = await knex('businesses')
    .select()
    .where({aws_user_id: req.currentUserId});
  user.businesses = businesses;

  const customer = await retrieveOrCreateCustomer(user);
  user.stripe_customer_id = customer.id;
  user.default_source = customer.default_source;

  await touch(user);

  res.json(user);
});

router.get('/users/auth', authorize, checkTimeout, async (req, res) => {
  const pin = Math.random()
    .toString(10)
    .slice(-6); // eslint-disable-line newline-per-chained-call
  await knex('kyc')
    .update({pin})
    .where({aws_user_id: req.currentUserId});
  const {phone, country_code} = await knex('kyc')
    .select('phone', 'country_code')
    .where({aws_user_id: req.currentUserId})
    .first();
  const PhoneNumber = `${country_code}${phone}`;
  const smsParams = {
    Message: pin,
    PhoneNumber,
  };
  const publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'})
    .publish(smsParams)
    .promise();
  try {
    await publishTextPromise;
    logger.info({message: 'Sent SMS message'});
    res.sendStatus(200);
  } catch (error) {
    logger.info({error});
    res.sendStatus(500);
  }
});

router.post('/users/auth', authorize, checkTimeout, async (req, res) => {
  const params = await kycUpdateSchema.validate(req.body);
  const {pin} = await knex('kyc')
    .select('pin')
    .where({aws_user_id: req.currentUserId})
    .first();
  if (pin === params.pin) {
    await knex('kyc')
      .update({verified: true})
      .where({aws_user_id: req.currentUserId});
    res.sendStatus(200);
  } else {
    res.sendStatus(406);
  }
});

router.post('/user/kyc', authorize, checkTimeout, async (req, res) => {
  const params = await kycSchema.validate(req.body, {presence: 'required'});
  params.aws_user_id = req.currentUserId;
  const response = await knex('kyc').insert(params, 'id');
  res.status(201);
  res.json({id: response[0]});
});

router.patch('/user', authorize, checkTimeout, async (req, res) => {
  const params = await updateSchema.validate(req.body);
  await knex('users')
    .where({aws_user_id: req.currentUserId})
    .update(params);
  res.sendStatus(204);
});

router.post('/user/admin', authorize, async (req, res) => {
  await addUserToAdminGroup({aws_user_id: req.currentUserId});
  res.sendStatus(201);
});

router.get('/user/kyc', authorize, checkTimeout, async (req, res) => {
  const results = await knex('kyc')
    .select('country_code', 'phone', 'verified')
    .where({aws_user_id: req.currentUserId})
    .first();

  res.status(200);
  res.json(results);
});

router.get('/user/businesses', authorize, checkTimeout, async (req, res) => {
  const results = await knex('businesses')
    .select()
    .where({aws_user_id: req.currentUserId});
  res.send(results);
});

router.get('/user/checkTimeout', authorize, checkTimeout, (req, res) =>
  res.sendStatus(204),
);

router.get('/user/updateTimeout', authorize, async (req, res) => {
  const user = req.currentUser;
  await touch(user);
  res.sendStatus(204);
});

router.get('/user/transactions', authorize, checkTimeout, async (req, res) => {
  const wallet_address = req.currentUser.wallet_address;
  logger.info({wallet_address});
  const response = await knex('transactions')
    .select()
    .where({address_from: wallet_address})
    .orWhere({address_to: wallet_address});

  res.json(response);
});

let eth = null;
router.get('/user/balance', authorize, checkTimeout, async (req, res) => {
  if (!eth) {
    eth = new Eth(config.eth.nodeAddr);
  }

  const balance = await eth.getBalance(req.currentUser.address);
  res.json({balance});
});
// authorize,
router.get('/users', async (req, res) => {
  const users = await listUsers();
  logger.info({type: 'getUsers', users});
  res.send(users);
});

router.get('/user/newBalance', authorize, checkTimeout, async (req, res) => {
  console.log(' req.currentUserId', req.currentUserId);
  const result = await knex('users')
    .select()
    .where({aws_user_id: req.currentUserId});
  console.log('results', results);
  if (result) {
    return res.send(result);
  } else {
    return res.send({status: 0, msg: 'record not found'});
  }
});

module.exports = router;
