const logger = require('./logger');

function authorize(req, res, next) {
  const token =
    (((req.apiGateway || {}).event || {}).requestContext || {}).authorizer ||
    {};
  // const token = {
  //   claims: {
  //     'custom:pin': '123456',
  //     sub: '1831904e-b57b-47df-8c43-48c488d6b9aa',
  //     email_verified: 'true',
  //     'custom:stripe_customer_id': 'cus_KRG04MB41rTxKn',
  //     iss: 'https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_Gl0noybEd',
  //     'cognito:username': '1831904e-b57b-47df-8c43-48c488d6b9aa',
  //     'custom:contract_user_id': '1',
  //     given_name: 'zohaib',
  //     origin_jti: '9d9a60c0-48a5-4501-b595-b8ab32b662a5',
  //     aud: '6q09t9qvvkcraneb1dltuojab3',
  //     event_id: '754f6dd0-98ba-44c6-be63-830f049f16b0',
  //     token_use: 'id',
  //     'custom:available_referrals': '0',
  //     auth_time: '1634670289',
  //     'custom:encrypted_key':
  //       '04fc92fbe7cc81d4aa4ee18a4a471295e2475108b7259b9bf33ac8bf569bb2f633e46059f52a5d26733e2ceff13977f0eb5087ca56ebe3d29be5f9a0275b727ac3e877925e486a7c9f01afcf5c5f8be1',
  //     name: 'zohaib ali',
  //     exp: 'Tue Oct 19 20:06:14 UTC 2021',
  //     iat: 'Tue Oct 19 19:06:14 UTC 2021',
  //     family_name: 'ali',
  //     'custom:wallet_address': '0xece0b17008653befbf38c4a1aeca14accc06972d',
  //     jti: '6cb51aa0-c7cd-43d0-a1bf-e1ad18d126a2',
  //     email: 'zohaibalishah1997@gmail.com',
  //     'custom:referral_code': 'Y3NY7P',
  //   },
  // };
  const claims = token.claims;
  if (!claims) {
    logger.error({message: 'user is not authorized'});
    res.sendStatus(403);
    return;
  }

  const user = {
    aws_user_id: claims.sub,
    email: claims.email,
    name: claims.name,
    given_name: claims.given_name,
    family_name: claims.family_name,
    stripe_customer_id: claims['custom:stripe_customer_id'],
    available_referrals: claims['custom:available_referrals'],
    encrypted_key: claims['custom:encrypted_key'],
    wallet_address: claims['custom:wallet_address'],
    referral_code: claims['custom:referral_code'],
    jwtToken: token,
    claims,
  };
  req.currentUser = user;
  req.currentUserId = user.aws_user_id;
  next();
}

function adminOnly(req, res, next) {
  const groups = req.currentUser.claims['cognito:groups'] || [];
  if (!groups.includes('admin')) {
    logger.error({message: 'unauthorized user', userId: req.currentUserId});
    res.sendStatus(403);
    return;
  }

  next();
}

module.exports = {
  authorize,
  adminOnly,
};
