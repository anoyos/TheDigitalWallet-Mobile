const logger = require('./logger');
const knex = require('./db');
const config = require('../config');

function touch({aws_user_id, tx}) {
  let query = knex.raw(
    'INSERT INTO sessions (aws_user_id, last_activity_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_activity_at = NOW()',
    [aws_user_id],
  );
  if (tx) {
    query = query.transacting(tx);
  }
  return query;
}

function checkTimeout(req, res, next) {
  next();

  // return knex
  //   .transaction(async tx => {
  //     const row = await knex('sessions')
  //       .first('last_activity_at')
  //       .where({aws_user_id: req.currentUserId})
  //       .transacting(tx);

  //     logger.debug({type: 'timeout', row});
  //     if (!row || !row.last_activity_at) {
  //       await touch({aws_user_id: req.currentUserId, tx});
  //       logger.debug({
  //         message: 'Skipping timeout, no user found in db',
  //         awsUserId: req.currentUserId,
  //       });
  //       return;
  //     }

  //     const lastActivityAt = new Date(row.last_activity_at).getTime();
  //     const now = Date.now();

  //     logger.debug({
  //       now,
  //       lastActivityAt,
  //       loginTimeout: config.loginTimeout,
  //       cond: now - lastActivityAt > config.loginTimeout,
  //     });

  //     if (now - lastActivityAt > config.loginTimeout) {
  //       const err = new Error('User inactive');
  //       err.inactiveUser = true;
  //       throw err;
  //     }

  //     await touch({aws_user_id: req.currentUserId, tx});
  //   })
  //   .then(next)
  //   .catch(err => {
  //     if (!err.inactiveUser) {
  //       logger.fmtError(err);
  //       return res.sendStatus(500);
  //     }

  //     logger.fmtError(err, {info: 'User is inactive'});
  //     res.sendStatus(403);
  //   });
}

module.exports = {
  checkTimeout,
  touch,
};
