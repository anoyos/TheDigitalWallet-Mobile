/* eslint-disable camelcase */
import gql from 'graphql-tag';
import upload from 'app/lib/upload';
import {apiRequest, apiV2Request} from './utils';

function transformCamelCase(object) {
  if (!object) return;
  // eslint-disable-next-line
  return Object.entries(object).reduce(
    (o, [k, v]) => ((o[k.replace(/_(\w)/g, (_, g) => g.toUpperCase())] = v), o),
    {},
  );
}
// user/kyc
export const getUserKYC = () => {
  return apiRequest('get', '/kyc').then(response =>
    transformCamelCase(response),
  );
};

export const getUserInfo = email => apiRequest('get', `/user/info/${email}`);

export const getSources = () => apiRequest('get', '/pay/sources');

export const getCustomerId = () => apiRequest('get', '/pay/id');

export const getUsers = () => {
  return apiRequest('get', '/users');
};
// no
export const sendPhoneRequest = () => apiRequest('get', '/kyc/send-pin');

export const getNotifications = async () => {
  const notifications = await apiRequest('get', '/notifications/user');
  notifications.sort((a, b) => a.created_at < b.created_at);

  return notifications;
};

export const getPendingGiftCards = () =>
  apiRequest('get', '/gift-cards/pending');

export const getAcceptedGiftCards = () =>
  apiRequest('get', '/gift-cards/accepted');

export const getBusiness = () => apiRequest('get', '/business');

export const getFriends = () => apiRequest('get', '/user/friends');

export const addFriend = (params, navigate) =>
  apiRequest('post', '/user/friend', params, navigate);

export const createNotification = (params, navigate) =>
  apiRequest('post', '/notifications', params, navigate);

export const readNotification = (id, navigate) =>
  apiRequest('post', '/notifications/mark-as-read', {id}, navigate);

export const getExchange = (params, navigate) =>
  apiRequest('post', '/exchange', params, navigate).then(response =>
    transformCamelCase(response),
  );

export const getTransactions = (params, navigate) =>
  apiRequest('post', '/transactions', params, navigate).then(response => {
    return transformCamelCase(response);
  });

export const getExchangeRate = (params, navigate) =>
  apiRequest('post', '/exchange/rate', params, navigate);

// no
export const sanityCheck = (params, navigate) =>
  apiRequest('post', '/transactions/sanity', params, navigate);

export const addToAdminGroup = (params, navigate) =>
  apiRequest('post', '/user/admin', params, navigate);

export const createPendingGiftCard = (params, navigate) =>
  apiRequest('post', '/gift-cards/create-pending', params, navigate);

export const createGiftCard = (params, navigate) =>
  apiRequest('post', '/gift-cards/create', params, navigate);

export const acceptGiftCard = (id, navigate) =>
  apiRequest('post', '/gift-cards/accept', {id}, navigate);

export const convertCurrencies = (params, navigate) =>
  apiRequest('post', '/exchange/convert', params, navigate);

// no
export const verifyPhone = (params, navigate) =>
  apiRequest('post', '/kyc/verify-phone', params, navigate);

export const createReferral = (params, navigate) =>
  apiRequest('post', '/referrals/create', params, navigate);

// no
// referrals/accept
export const acceptReferral = (params, navigate) =>
  apiV2Request('post', '/accept-referral', params, navigate);

export const declineReferral = (params, navigate) =>
  apiRequest('post', '/referrals/decline', params, navigate);

export const isReferred = () =>
  apiRequest('get', '/referrals/is-referred').then(res =>
    transformCamelCase(res),
  );

export const getReferrals = () =>
  apiRequest('get', '/referrals').then(res =>
    res.map(response => transformCamelCase(response)),
  );

export const getPendingReferrals = () =>
  apiRequest('get', '/referrals/pending').then(res =>
    res.map(response => transformCamelCase(response)),
  );

export const getPlans = () => apiRequest('get', '/pay/plans');
export const getNewBalance = () => apiRequest('get', '/user/newBalance');

// no
export const getAvailableReferrals = () =>
  apiRequest('get', '/user/availableReferrals').then(res =>
    transformCamelCase(res),
  );

export const saveSource = (source, navigate) =>
  apiRequest('post', '/pay/sources', {source}, navigate);

export const charge = (params, navigate) =>
  apiRequest('post', '/pay/charge', params, navigate);

export const subscribe = (params, navigate) =>
  apiRequest('post', '/pay/subscribe', params, navigate);

export const createCardToken = (params, navigate) =>
  apiRequest('post', '/pay/cardToken', params, navigate);

export const createUser = (
  {
    awsUserId: aws_user_id,
    email,
    encryptedKey: encrypted_key,
    address,
    usedReferralCode,
  },
  navigate,
) => {
  const user = {aws_user_id, email, encrypted_key, address};
  if (usedReferralCode !== '') user.used_referral_code = usedReferralCode;

  return apiRequest('post', '/user', user, navigate);
};

export const updateUser = async (
  {awsUserId: aws_user_id, email, encryptedKey: encrypted_key, address, pin},
  navigate,
) => {
  const user = {
    aws_user_id,
    email,
    encrypted_key,
    address,
    pin,
  };

  apiRequest('patch', '/user', user, navigate);
};
// no
export const addBankAccount = (params, navigate) =>
  apiRequest('post', '/user/bankInfo', params, navigate);
//no
export const getBankAccounts = () =>
  apiRequest('get', '/user/bankInfo').then(res =>
    res.bankAccounts.map(b => transformCamelCase(b)),
  );
//no

export const updateBankAccount = (params, navigate) =>
  apiRequest('patch', '/user/bankInfo', params, navigate);
//no

export const removeBankAccount = (params, navigate) =>
  apiRequest('del', '/user/bankInfo', params, navigate);
//no

export const withdrawFromDigitall = (params, navigate) =>
  apiRequest('post', '/withdraws', params, navigate);

export const getBusinesses = () =>
  apiRequest('get', '/businesses')
    .then(res => res.map(p => transformCamelCase(p)))
    .then(res =>
      res.map(b => ({...b, distanceFromLocation: Number.MAX_SAFE_INTEGER})),
    );

export const getPromotions = () =>
  apiRequest('get', '/promotions').then(res =>
    res.map(p => transformCamelCase(p)),
  );

export const getUserTransactions = () =>
  apiRequest('get', '/user/transactions').then(res =>
    res
      .map(p => transformCamelCase(p))
      .sort((a, b) => b.timestamp - a.timestamp),
  );
// no
export const uploadBillImage = image =>
  apiV2Request('post', '/images/upload-bill-image', {}, image);
// no
export const uploadPassportImage = image =>
  apiV2Request('post', '/images/upload-passport-image', {}, image);

export const addKYC = async ({
  billImage,
  passportImage,
  phone,
  countryCode,
}) => {
  const id = await apiRequest('post', '/kyc', {
    phone,
    country_code: countryCode,
  });
  await uploadBillImage(billImage);
  await uploadPassportImage(passportImage);

  return {id};
};

export const createBusiness = async ({
  name,
  description,
  streetAddress: street_address,
  formattedAddress: formatted_address,
  latitude,
  longitude,
  phone,
  websiteUrl: website_url,
  image,
  categoryId: category_id,
  encryptedKey: encrypted_key,
  address,
}) => {
  const presignedLink = await apiRequest('get', '/presigned_link');
  const image_url = await upload(image, presignedLink);

  const id = await apiRequest('post', '/businesses', {
    name,
    description,
    street_address,
    formatted_address,
    phone,
    latitude,
    longitude,
    website_url,
    image_url,
    category_id,
    encrypted_key,
    address,
  });

  return {id, imageUrl: image_url};
};

// Apollo GraphQL calls
export const CREATE_COINBASE_CHARGE = gql`
  mutation createCoinbaseCharge($input: CreateCoinbaseChargeInput!) {
    createCoinbaseCharge(input: $input) {
      id
      name
      description
      code
      created_at
      expires_at
      hosted_url
      metadata {
        aws_user_id
        wallet_address
      }
      status
      payments
      pricing_type
      resource
      support_email
      timeline
      addresses {
        bitcoin
        ethereum
        litecoin
      }
      pricing {
        local {
          amount
          currency
        }
        bitcoin {
          amount
          currency
        }
        ethereum {
          amount
          currency
        }
        litecoin {
          amount
          currency
        }
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser {
    addUser
  }
`;
export const USE_REFERRAL_CODE = gql`
  mutation useReferralCode($referralCode: String!) {
    useReferralCode(referralCode: $referralCode)
  }
`;
export const GET_SUM_SUB_ACCESS_CODE = gql`
  query requestAccessToken {
    requestAccessToken {
      token
      userId
    }
  }
`;
export const GET_KYC_REVIEW = gql`
  query kycReview {
    kycReview {
      status
      answer
      rejectLabels
      moderationComment
      reviewRejectType
    }
  }
`;
