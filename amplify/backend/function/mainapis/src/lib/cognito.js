const AWS = require('aws-sdk');
const config = require('../config');
const logger = require('../lib/logger');

const cisp = new AWS.CognitoIdentityServiceProvider();

async function listUsers(filter = '') {
  let users = [];
  let result = {};
  do {
    result = await cisp
      .listUsers({
        // eslint-disable-line no-await-in-loop
        UserPoolId: config.congitoUserPoolId,
        AttributesToGet: ['email', 'name', 'custom:wallet_address'],
        Filter: filter,
        PaginationToken: result.PaginationToken,
      })
      .promise();
    users = users.concat(result.Users);
  } while (result.PaginationToken);

  return users;
}

function addUserToAdminGroup(user) {
  return cisp
    .adminAddUserToGroup({
      GroupName: config.groups.admin,
      UserPoolId: config.congitoUserPoolId,
      Username: user.aws_user_id,
    })
    .promise();
}

function updateUser(user, attributes) {
  return cisp.adminUpdateUserAttributes({
    UserAttributes: attributes,
    Username: user.aws_user_id,
    UserPoolId: config.congitoUserPoolId,
  });
}

module.exports = {
  listUsers,
  addUserToAdminGroup,
  updateUser,
};

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-line no-process-env
  const {User} = require('../test/factories');

  const mock = (obj, fn, v) => {
    obj[fn.name] = (...args) => {
      const value = typeof v === 'function' ? v(...args) : v;
      logger.debug({type: 'cognito', name: fn.name, value});
      return value;
    };
  };
  /* eslint-disable */
  mock(module.exports, listUsers, (n = 5) =>
    Promise.all(
      Array(n)
        .fill(0)
        .map(() => User.create()),
    ),
  );
  mock(
    module.exports,
    addUserToAdminGroup,
    u => (u.claims['cognito:groups'].push('admin'), u),
  );
  mock(module.exports, updateUser, u => u);
  /* eslint-enable */
}
