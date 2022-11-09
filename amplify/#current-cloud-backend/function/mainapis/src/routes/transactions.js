const { Router } = require("express");
const { authorize } = require("../lib/auth");
const knex = require('../lib/db')
const logger = require("../lib/logger")
const Joi = require("joi")
const { checkTimeout } = require('../lib/timeout')

const router = Router();

const transactionsSchema = Joi.object().keys({
  offset: Joi.number().integer().required(),
  limit: Joi.number().integer().required(),
})

router.post('/transactions', authorize, checkTimeout, async (req, res) => {
  const { offset, limit } = await transactionsSchema.validate(req.body);
  const idArray = await knex('transactions').max('id', {as: 'id'})
  const maxId = idArray[0]["max(`id`)"]

  if (offset > maxId) res.sendStatus(403)
  else {
    const response = await knex('transactions')
      .select('id', 'timestamp', 'value')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(offset)
  
    res.json({ transactions: Object.values(response) });
  }
})

module.exports = router;
