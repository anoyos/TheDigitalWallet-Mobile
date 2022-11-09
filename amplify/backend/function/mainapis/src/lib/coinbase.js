const { Webhook, Client, resources: { Charge } } = require('coinbase-commerce-node')
const logger = require("./logger")
const config = require("../config")

if (process.env.NODE_ENV !== 'test') { // eslint-disable-line no-process-env
  Client.init("1b47061264138c4ac30d75fd1eb44270")
}

/**
 * @param {string} data Raw data
 * @param {string} signature Signature from `x-cc-webhook-signature` header
 * @returns {Object} Event data
 */
function verifyWebhook(data, signature) {
  return Webhook.verifyEventBody(
    data,
    signature,
    config.coinbase.webhookSecret,
  );
}

function createCharge(data) {
  const charge = new Charge(data);
  return charge.save();
}

module.exports = {
  verifyWebhook,
  createCharge,
}

if (process.env.NODE_ENV === 'test') { // eslint-disable-line no-process-env
  const factory = require('../test/factories/coinbase')

  const mock = (obj, fn, v) => {
    obj[fn.name] = (...args) => {
      const value = typeof v === 'function' ? v(...args) : v;
      logger.debug({ type: "coinbase", name: fn.name, value })
      return value;
    }
  }
  mock(module.exports, verifyWebhook, d => JSON.parse(d))
  mock(module.exports, createCharge, d => Promise.resolve(factory.charge({ aws_user_id: d.metadata.aws_user_id })))
}

