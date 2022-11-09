import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
var AWS = require('aws-sdk');

import {
  setGenericPassword,
  resetGenericPassword,
  getGenericPassword,
} from 'react-native-keychain';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from 'app/lib/NavigationService';
import {
  createHashKeyFromEncKey,
  decrypt,
  createHashKey,
  encrypt,
} from 'app/lib/pkey';
import Ethereum from 'app/lib/eth';
import config from 'app/config';
import * as api from 'app/lib/api';
import {
  checkBuffer,
  generateEthUserData,
  generateReferralCode,
  getCurrency,
} from 'app/lib/auth/utils';
import {message} from 'app/lib/toast';
import {JS} from 'aws-amplify';
import {localize} from 'app/lib/currency';

/**
 * Cognito Auth Library
 *
 * Initialized with pool data and a blank user;
 * once logged in cognitoUser becomes active user.
 */
const poolData = {
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.userPoolWebClientId,
};
var userPool = new CognitoUserPool(poolData);
let cognitoUser = new CognitoUser({Username: '', Pool: userPool});

/**
 * Generate all custom user data and sign up with cognito.
 * @param {object} input - User details object.
 * @param {function} setLoading - Toggle loading state function.
 * @param {function} dispatch - Global state action dispatcher.
 */

const checkUserAlreadyinCOgnitive = () => {
  return new Promise((resolve, reject) => {
    AWS.config.update({
      region: 'eu-west-2',
      accessKeyId: 'AKIA5PQS5SZ7N6C5VKMB',
      secretAccessKey: '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',
    });
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    var params = {
      UserPoolId: 'eu-west-2_Gl0noybEd' /* required */,
      AttributesToGet: ['email'],
      Limit: 0,
    };
    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
      if (err) {
      } else {
        const usersList = [];
        data.Users.map(user => {
          usersList.push({
            email: user.Attributes[0].Value,
            UserStatus: user.UserStatus,
            Enabled: user.Enabled,
          });
        });
        resolve(usersList);
      }
    });
  });
};

export const signUp = async (
  {
    firstName,
    lastName,
    email,
    password,
    username,
    isCustomer,
    usedReferralCode,
  },
  setLoading,
  dispatch,
  setMessage,
) => {
  const attributeList = [];
  const result = await checkUserAlreadyinCOgnitive();
  if (result.length > 0) {
    let user = result.find(o => o.email == email);
    if (user) {
      if (user.UserStatus == 'CONFIRMED') {
        alert(JSON.stringify('User with this email already exist'));
        setLoading(false);
        return;
      } else {
        alert(
          JSON.stringify('User with this email already exist but not verified'),
        );
        setLoading(false);
        return;
      }
    }
  }
  const referralCode = generateReferralCode();
  try {
    setMessage('Please wait Creating Wallet');
    const {address, encryptedKey, hashKey} = await generateEthUserData(
      password,
    );
    const eth = await Ethereum.create({encryptedKey, hashKey});
    await eth.createUser(false);
    setMessage('Please wait Creating User');
    const userId = await eth.getUserId(address);

    const attributes = [
      {Name: 'given_name', Value: firstName},
      {Name: 'family_name', Value: lastName},
      {Name: 'name', Value: `${firstName} ${lastName}`},
      {Name: 'email', Value: email},
      {Name: 'custom:wallet_address', Value: address},
      {Name: 'custom:encrypted_key', Value: encryptedKey},
      {Name: 'custom:referral_code', Value: referralCode},
      {Name: 'custom:available_referrals', Value: '0'},
      {Name: 'custom:contract_user_id', Value: userId},
    ];

    // eslint-disable-next-line no-unused-vars
    for (const attribute of attributes) {
      const cognitoAttribute = new CognitoUserAttribute(attribute);
      attributeList.push(cognitoAttribute);
    }
    setMessage('Please wait Sending Email');
    userPool.signUp(username, password, attributeList, null, async err => {
      try {
        if (err) throw err;
        dispatch({
          type: 'setUser',
          payload: {
            email,
            username,
            referralCode,
            isCustomer,
            usedReferralCode,
          },
        });
        await setGenericPassword(username, password);
        setLoading(false);
        NavigationService.navigate('ConfirmEmail');
      } catch (error) {
        setLoading(false);
        alert(JSON.stringify(err.message));
        // message(err.message);
      }
    });
  } catch (err) {
    setLoading(false);
    alert(JSON.stringify(err.message));
    // message(err.message);
  }
};

/**
 * Confirm user's email.
 * @param {object} input - Username and one time confirmation code.
 * @param {function} fn - Callback function.
 */
export const confirmUser = ({username, pin}, fn) => {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  cognitoUser = new CognitoUser(userData);

  cognitoUser.confirmRegistration(pin, true, err => {
    fn(err);
  });
};

/**
 * Resend confirmation code in order to verify user.
 * @param {object} input - Username and password.
 * @param {function} setLoading - Toggle loading state function.
 */
export const resendConfirmationCode = ({username, password}, setLoading) => {
  var userData = {
    Username: username,
    Pool: userPool,
  };
  let cognitoUser = new CognitoUser(userData);
  cognitoUser.resendConfirmationCode(async err => {
    try {
      if (err) throw err;
      await setGenericPassword(username, password);
      setLoading(false);
      NavigationService.navigate('ConfirmEmail');
    } catch (error) {
      alert(JSON.stringify(error.message));
      setLoading(false);
      // message('Unable to ressend confirmation code.');
    }
  });
};

/**
 * Login in a user and set async storage and global state.
 * @param {object} input - Username and password for login.
 * @param {function} setLoading - Toggle loading state function.
 * @param {function} dispatch - Global state action dispatcher.
 * @param {function} fn - Callback function.
 */
export const login = ({username, password}, setLoading, dispatch, fn) => {
  const authenticationData = {Username: username, Password: password};
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: username,
    Pool: userPool,
  };

  cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    async onSuccess(result) {
      try {
        const {payload, jwtToken} = result.getIdToken();
        const groups = payload['cognito:groups'] || [];
        const hashKey = await createHashKeyFromEncKey(
          payload['custom:encrypted_key'],
          password,
        );

        const {currency, locales} = await getCurrency();
        await setGenericPassword(username, password);
        const user = {
          id: payload.sub,
          hashKey,
          currency,
          locales,
          isCustomer: !groups.includes('admin'),
          admin: groups.includes('admin'),
          superAdmin: groups.includes('superadmin'),
          customerId: payload['custom:stripe_customer_id'] || '',
          referralCode:
            payload['custom:custom_referral_code'] ||
            payload['custom:referral_code'],
          pin: payload['custom:pin'],
          availableReferrals: payload['custom:available_referrals'],
          kyc: {phone: '', status: payload['custom:kyc_status'] || null},
          walletAddress: payload['custom:wallet_address'],
          encryptedKey: payload['custom:encrypted_key'],
          firstName: payload.given_name,
          lastName: payload.family_name,
          name: payload.name,
          phone_number: payload.phone_number,
          email: payload.email,
          alias: payload['custom:alias'],
          newBalance:
            payload['custom:newBalance'] > 0
              ? localize(payload['custom:newBalance'] / 10 ** 6, locales)
              : localize(payload['custom:newBalance1'] / 10 ** 6, locales) ||
                0.0,
          USD: payload['custom:USD'] || 0.0,
          GBP: payload['custom:GBP'] || 0.0,
          Gold: payload['custom:Gold'] || 0.0,
          Silver: payload['custom:Silver'] || 0.0,
          EUR: payload['custom:EUR'] || 0.0,
          CAD: payload['custom:CAD'] || 0.0,
          JPY: payload['custom:JPY'] || 0.0,
          XRP: payload['custom:XRP'] || 0.0,
          CHF: payload['custom:CHF'] || 0.0,
          BTC: payload['custom:BTC'] || 0.0,
          AUD: payload['custom:AUD'] || 0.0,
          ETH: payload['custom:ETH'] || 0.0,
          EURSTOXX: payload['custom:EURSTOXX'] || 0.0,
          Oil: payload['custom:Oil'] || 0.0,
          SP: payload['custom:SP'] || 0.0,
          username,
        };

        const stringUser = JSON.stringify(user);
        const stringTokens = JSON.stringify({
          jwtToken,
          refreshToken: result.getRefreshToken(),
        });

        const firstPair = ['user', stringUser];
        const secondPair = ['tokens', stringTokens];

        await AsyncStorage.multiSet([firstPair, secondPair]);

        setLoading(false);
        dispatch({type: 'setUser', payload: user});
        fn({isCustomer: !groups.includes('admin')});
      } catch (error) {
        console.log('error............', error);
        message('Unable to loggin at this time.');
        setLoading(false);
      }
    },
    onFailure(error) {
      dispatch({type: 'setUser', payload: {email: username}});
      fn({error});
    },
  });
};

/**
 * Retrieve current session.
 * @param {function} fn - Callback function.
 */
export const currentSession = fn => {
  userPool.storage.sync((error, result) => {
    if (error) {
      fn(error);
    } else if (result === 'SUCCESS') {
      cognitoUser = userPool.getCurrentUser();
      if (cognitoUser !== null) {
        cognitoUser.getSession((err, session) => {
          fn(err, session);
        });
      } else {
        fn(new Error('Unable to get current user.'));
      }
    } else {
      fn(new Error('Unable to get current session.'));
    }
  });
};

/**
 * Refreshes current session using refresh token from async storage.
 * @param {function} fn - Callback function.
 */
export const refreshCurrentSession = async fn => {
  const tokens = JSON.parse(await AsyncStorage.getItem('tokens'));
  if (!tokens) {
    fn(new Error('No token in storage.'));
  } else {
    const token = new CognitoRefreshToken({
      RefreshToken: tokens.refreshToken.token,
    });

    cognitoUser.refreshSession(token, async (err, session) => {
      try {
        if (err) throw err;

        const {jwtToken} = session.getIdToken();
        const newTokens = JSON.stringify({
          jwtToken,
          refreshToken: session.getRefreshToken(),
        });
        await AsyncStorage.setItem('tokens', newTokens);
        fn(null, session);
      } catch (e) {
        fn(e);
        message('Unable to refresh current session.');
      }
    });
  }
};

/**
 * Updates attributes iteratively then calls callback.
 * @param {object} input - Object with list of attributes.
 * @param {function} fn - Callback function.
 */
export const updateAttributes = ({attributes}, fn) => {
  const attributeList = [];

  // eslint-disable-next-line no-unused-vars
  for (const attribute of attributes) {
    const cognitoAttribute = new CognitoUserAttribute(attribute);
    attributeList.push(cognitoAttribute);
  }

  cognitoUser.updateAttributes(attributeList, (err, result) => fn(err, result));
};

/**
 * Calls callback function with result of get attributes.
 * @param {function} fn - Callback function.
 */
export const getUserAttributes = fn => {
  cognitoUser.getUserAttributes((err, result) => fn(err, result));
};

/**
 * Changes password and updates async storage, keychain, and global state.
 * @param {object} input - User, old password and new password.
 * @param {function} setLoading - Toggle loading state function.
 * @param {function} dispatch - Global state action dispatcher.
 */
export const changePassword = (
  {user, oldPassword, newPassword},
  setLoading,
  navigate,
  dispatch,
) => {
  cognitoUser.changePassword(oldPassword, newPassword, async err => {
    try {
      if (err) throw err;

      const privateKey = await decrypt(user.encryptedKey, user.hashKey);
      const hashKey = await createHashKey(newPassword);
      const encryptedKey = await encrypt(privateKey, hashKey);

      updateAttributes(
        {attributes: [{Name: 'custom:encrypted_key', Value: encryptedKey}]},
        async e => {
          try {
            if (e) throw e;

            const newUser = {...user, encryptedKey, hashKey};
            const stringUser = JSON.stringify(newUser);
            await AsyncStorage.setItem('user', stringUser);
            await setGenericPassword(user.email, newPassword);
            dispatch({type: 'setUser', payload: {encryptedKey, hashKey}});
            setLoading(false);
            navigate('Wallets');
          } catch (e1) {
            setLoading(false);
            message('Unable to update attributes at this time.');
          }
        },
      );
    } catch (e2) {
      setLoading(false);
      message('Unable to change password at this time.');
    }
  });
};

/**
 * Signs out of cognito and clears all relavent state.
 * @param {object} timer - Global state object containing timer ids.
 * @param {client} client - Apollo GraphQL client.
 * @param {function} dispatch - Global state action dispatcher.
 * @param {function} setLoading - Toggle loading state function.
 */
export const signOut = async (
  timer,
  client,
  dispatch,
  setLoading = () => {},
) => {
  try {
    clearInterval(timer.id1);
    clearInterval(timer.id2);
    client.clearStore();
    cognitoUser.signOut();
    await AsyncStorage.multiRemove(['user', 'tokens']);
    await resetGenericPassword();

    dispatch({type: 'resetUser'});
    dispatch({type: 'resetGiftCards'});
    dispatch({type: 'resetNotifications'});
    dispatch({type: 'resetBankAccounts'});
    dispatch({type: 'resetTransactions'});
    dispatch({type: 'resetTimer'});
    dispatch({type: 'resetContractValues'});

    setLoading(false);
    setTimeout(() => NavigationService.navigate('Auth'), 100);
  } catch (err) {
    setLoading(false);
  }
};

/**
 * Check to see if all user data is availbe to log back in without requesting password.
 * @param {object} timer - Global state object containing timer ids.
 * @param {function} setLoading - Toggle loading state function.
 * @param {client} client - Apollo GraphQL client.
 * @param {string} screen - Destination screen name.
 * @param {function} dispatch - Global state action dispatcher.
 */
export const checkLoggedIn = (timer, setLoading, client, dispatch) => {
  setLoading(true);
  clearInterval(timer.id1);
  clearInterval(timer.id2);
  refreshCurrentSession(async e => {
    try {
      if (e) throw e;

      const {username, password} = await getGenericPassword();

      if (!username || !password)
        throw new Error('Unable to load credentials.');

      const user = JSON.parse(await AsyncStorage.getItem('user'), checkBuffer);

      if (!user) throw new Error('User not found.');
      if (user.email !== username)
        throw new Error('The stored usernames do not match.');
      if (!user.encryptedKey)
        throw new Error('Unable to locate encrypted key.');
      if (Object.keys(user.hashKey).length === 0)
        throw new Error('Unable to locate hash key.');
      dispatch({type: 'setUser', payload: user});
      setLoading(false);
      NavigationService.navigate('Pin');
    } catch (err) {
      setLoading(false);
      signOut(timer, client, dispatch, setLoading);
    }
  });
};

export const confirmForgotPassword = ({pin, newPassword}, fn) => {
  cognitoUser.confirmPassword(pin, newPassword, {
    onSuccess(result) {
      // const hashKey = await createHashKey(password)
      // const randomKey = await create()
      // const [privateKey, address] = await createWallet(randomKey)
      // const encryptedKey = await encrypt(privateKey.slice(2), hashKey)

      // await Keychain.setGenericPassword(email, password)
      fn(null, result);
    },
    onFailure(err) {
      fn(err);
    },
  });
};

export const confirmUserForgotPassword = (
  pin,
  newPassword,
  setLoading,
  navigation,
  toast,
) => {
  cognitoUser.confirmPassword(pin, newPassword, {
    onSuccess(result) {
      toast.info('Password reset successfully. You can login now.');
      setLoading(false);
      return navigation.goBack();
      // const hashKey = await createHashKey(password)
      // const randomKey = await create()
      // const [privateKey, address] = await createWallet(randomKey)
      // const encryptedKey = await encrypt(privateKey.slice(2), hashKey)

      // await Keychain.setGenericPassword(email, password)
      // fn(null, result);
    },
    onFailure(err) {
      console.log('err ..', err);
      setLoading(false);

      // fn(err);
    },
  });
};

export const userForgotPassword = (username, fn) => {
  var userData = {
    Username: username,
    Pool: userPool,
  };
  let cognitoUser = new CognitoUser(userData);
  cognitoUser.forgotPassword({
    onSuccess(result) {
      fn(null, result);
    },
    onFailure(err) {
      fn(err);
    },
  });
};

export const forgotPassword = fn => {
  cognitoUser.forgotPassword({
    onSuccess(result) {
      fn(null, result);
    },
    onFailure(err) {
      fn(err);
    },
  });
};
