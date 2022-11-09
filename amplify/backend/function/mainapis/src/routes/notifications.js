const { Router } = require("express");
const Joi = require('joi')
const knex = require('../lib/db')
const logger = require('../lib/logger')
const { authorize } = require('../lib/auth')
const { checkTimeout } = require('../lib/timeout')

const router = Router();

const notificationsSchema = Joi.object().keys({
  aws_user_id: Joi.string(),
  message: Joi.string(),
  payload: Joi.string(),
})

const markAsReadSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    id: Joi.number().integer(),
  })

router.post('/notifications', authorize, checkTimeout, async (req, res) => {
  const params = await notificationsSchema.validate(req.body, { abortEarly: true, stripUnknown: true });

  try {
    await knex('notifications').insert({
      aws_user_id: params.aws_user_id,
      message: params.message,
      payload: params.payload,
    });
  } catch (error) {
    logger.info({ type: 'error', error })
    res.sendStatus(500);
  }

  res.sendStatus(200);
});

router.post('/notifications/mark-as-read', authorize, checkTimeout, async (req, res) => {
  const { id } = await markAsReadSchema.validate(req.body, { presence: 'required' });

  await knex('notifications')
    .update({ read: true })
    .where({ id });

  res.status(200);
})

router.get('/notifications/user', authorize, async (req, res) => {
  const notifications = await knex('notifications')
    .select()
    .where({ aws_user_id: req.currentUserId, read: false });

  res.json(notifications);
});

router.patch('/notifications/:id', authorize, checkTimeout, async (req, res) => {
  const schema = Joi.object().keys({
    read: Joi.boolean().required(),
  })
  const params = await schema.validate(req.body, { abortEarly: false, stripUnknown: true })

  await knex('notifications')
    .update({ read: params.read })
    .where({ aws_user_id: req.currentUserId, id: req.params.id });

  res.sendStatus(200);
})

module.exports = router;
