const {Router} = require('express');
const Joi = require('joi');
const logger = require('../lib/logger');
const config = require('../config');
const knex = require('../lib/db');
const {authorize} = require('../lib/auth');
const stripe = require('../lib/stripe');
const {mint} = require('../lib/eth');
const {checkTimeout} = require('../lib/timeout');
const bodyParser = require('body-parser');
const stripe1 = require('stripe');
const router = Router();

const chargeSchema = Joi.object().keys({
  amount: Joi.number().integer(),
  currency: Joi.string(),
  source: Joi.string(),
});

const subscriptionSchema = Joi.object().keys({
  plan: Joi.string(),
  source: Joi.string(),
});

router.get('/pay/id', authorize, checkTimeout, async (req, res) => {
  const user = req.currentUser;
  const customer = await stripe.retrieveOrCreateCustomer(user);
  const stripe_customer_id = customer.id;

  res.json({stripe_customer_id});
});

router.get('/pay/charges', authorize, async (req, res) => {
  const charges = await knex('charges')
    .select()
    .where({aws_user_id: req.currentUserId});
  res.json(charges);
});

router.get('/pay/charges/:id', authorize, async (req, res) => {
  const charge = await knex('charges')
    .select()
    .where({aws_user_id: req.currentUserId, id: req.params.id});
  res.json(charge);
});

router.post('/pay/charge', authorize, async (req, res) => {
  const params = await chargeSchema.validate(req.body, {presence: 'required'});

  const user = req.currentUser;

  const customer = await stripe.retrieveOrCreateCustomer(user);
  user.stripe_customer_id = customer.id;

  const charge = await stripe.createCharge(user, {
    amount: params.amount,
    currency: params.currency,
    customer: customer.id,
    source: params.source,
  });

  res.json({charge});
});

// no
router.post('/pay/subscribe', authorize, async (req, res) => {
  const {plan, source} = await subscriptionSchema.validate(req.body, {
    presence: 'required',
  });

  const user = req.currentUser;

  const customer = await stripe.retrieveOrCreateCustomer(user);
  user.stripe_customer_id = customer.id;

  const subscription = await stripe.createSubscription(user, {
    plan,
    source,
  });

  res.json({subscription});
});

router.get('/pay/sources', authorize, checkTimeout, async (req, res) => {
  const sources = await stripe.listSources(req.currentUser);
  res.json({sources});
});

router.get('/pay/id', authorize, checkTimeout, async (req, res) => {
  const user = req.currentUser;
  const customer = await stripe.retrieveOrCreateCustomer(user);
  const stripe_customer_id = customer.id;
  res.json({stripe_customer_id});
});

router.get('/pay/plans', authorize, async (req, res) => {
  const plans = await stripe.listPlans();
  res.json({plans});
});

router.post('/pay/sources', authorize, async (req, res) => {
  const schema = Joi.object().keys({source: Joi.string()});
  const params = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const sources = await stripe.createSource(req.currentUser, params.source);
  res.json({sources});
});

router.patch('/pay/sources', authorize, async (req, res) => {
  const schema = Joi.object().keys({
    source: Joi.string().required(),
    address_city: Joi.string(),
    address_country: Joi.string(),
    address_line1: Joi.string(),
    address_line2: Joi.string(),
    address_state: Joi.string(),
    address_zip: Joi.string(),
    exp_month: Joi.string().regex(/[0-9]{2}/),
    exp_year: Joi.string().regex(/[0-9]{4}/),
    name: Joi.string(),
  });
  const params = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const sources = await stripe.updateSource(req.currentUser, params.source);
  res.json({sources});
});

router.delete('/pay/sources', authorize, async (req, res) => {
  const schema = Joi.object().keys({
    source: Joi.string().required(),
  });
  const params = await schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  const sources = await stripe.deleteSource(req.currentUser, params.source);
  res.json({sources});
});

router.post(
  '/stripe-webhook',
  bodyParser.raw({type: '*/*'}),
  async (req, res) => {
    // let event;
    // try {
    //   event = stripe.constructEvent(
    //     req.body,
    //     req.headers['stripe-signature'],
    //     whsec_nOhznHp0ulKbRA9Jk9PgsMAv14fh4hw7,
    //     // 'whsec_lybTYiYrHIXlJcp2DWIwMeq6T7nHSNZ7',
    //     // config.stripeSigningSecret,
    //   );
    // } catch (err) {
    //   return res.status(403).json(`Webhook Error: ${err.message}`);
    //   //TODO: remove this hack
    // }
    let event;
    try {
      event = stripe1.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        'whsec_nOhznHp0ulKbRA9Jk9PgsMAv14fh4hw7',
      );
    } catch (err) {
      res.status(403).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded': {
        let contract_address = null;
        const charge = event.data.object;
        const response = await knex('exchange_contracts')
          .select('address')
          .where('symbol', charge.currency.toUpperCase());
        if (response[0]) contract_address = response[0].address;
        else {
          knex('exchange_contracts')
            .select('address')
            .where('symbol', 'USD')
            // eslint-disable-next-line no-return-assign
            .then(usd_response => (contract_address = usd_response[0].address));
        }
        const amount = parseInt(charge.amount, 10);

        const bal_amount = parseInt(
          (amount / 100) * config.conversionRate * 10 ** 6,
          10,
        );
        const {wallet_address, aws_user_id} = charge.metadata;
        const [charge_id] = await knex('charges').insert(
          {
            pending: true,
            aws_user_id,
            stripe_charge_token: charge.id,
            amount,
            bal_amount,
            currency: charge.currency,
            success: true,
            event_created: event.created,
            event_id: event.id,
          },
          'id',
        );
        mint({
          aws_user_id,
          charge_id,
          to: wallet_address,
          amount: bal_amount,
          contract_address,
        })
          .then(tx => logger.info({type: 'minting', tx}))
          .catch(err => logger.fmtError(err, {type: 'minting'}));
        break;
      }
      case 'charge.failed': {
        const charge = event.data.object;
        const amount = parseInt(charge.amount, 10);
        const bal_amount = parseInt(
          (amount / 100) * config.conversionRate * 10 ** 6,
          10,
        );
        const {aws_user_id} = charge.metadata;
        await knex('charges').insert({
          aws_user_id,
          stripe_charge_token: charge.id,
          amount,
          bal_amount,
          currency: charge.currency,
          success: false,
          event_created: event.created,
          event_id: event.id,
        });
        break;
      }
      default:
        return res.sendStatus(400);
    }

    res.json({received: true});
  },
);

module.exports = router;
