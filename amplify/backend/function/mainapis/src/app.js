const {performance} = require('perf_hooks');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

// eslint-disable-next-line no-empty-function
module.exports = function createApp(inject = () => {}) {
  // declare a new express app
  const app = express();

  // Use JSON parser for all non-webhook routes
  app.use((req, res, next) => {
    if (req.originalUrl.includes('stripe-webhook')) {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  });

  inject(app);
  // Enable CORS for all methods

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Authorization, X-Requested-With, Content-Type, Accept',
    );

    if (req.method === 'OPTIONS') {
      res.send(204);
    } else {
      next();
    }
  });

  // log request
  app.use((req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
      const end = performance.now();
      const {method, path, currentUserId, params, body} = req;
      logger.debug({
        method,
        path,
        time: end - start,
        currentUserId,
        body,
        params,
      });
    });
    next();
  });
  app.use(awsServerlessExpressMiddleware.eventContext());

  app.use('/', require('./routes'));

  app.use((err, req, res, _next) => {
    if (err.isJoi) {
      return res
        .status(422)
        .json({name: 'ValidationError', errors: err.details});
    }
    logger.fmtError(err);
    res.status(500).json({name: err.name, errors: [err.message]});
  });

  return app;
};
