const { Router } = require("express");
const QRCode = require('qrcode')
const Joi = require("joi")

const router = Router();

const qrSchema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    wallet_address: Joi.string().required(),
    amount: Joi.string().required(),
    symbol: Joi.string().required(),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
  })

router.post('/qr/new', async (req, res) => {
  const { wallet_address, amount, symbol, name, email } = await qrSchema.validate(req.body)
  const qrText = JSON.stringify({ toAddress: wallet_address, amount, name, symbol, email })
  const data = await QRCode.toDataURL(qrText)

  res.json({ data })
})

module.exports = router
