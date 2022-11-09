export default function userReducer(user, action) {
  switch (action.type) {
    case 'setUser':
      const verified_emails = [
        'jason.noble@live.com',
        'zohaibalishah41@gmail.com',
        'kaleemullahlqp@gmail.com',
      ];
      var result = null;
      if (verified_emails.includes(action.payload.email)) {
        result = {
          ...action.payload,
          kyc: {phone: '', status: 'verified'},
        };
      } else {
        result = {...action.payload};
      }
      return {...user, ...result};
    case 'setUserLocation':
      return {
        ...user,
        coords: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          latitudeDelta: action.payload.latitudeDelta,
          longitudeDelta: action.payload.longitudeDelta,
        },
      };
    case 'resetUser':
      return {
        id: '',
        email: '',
        admin: false,
        superAdmin: false,
        pin: '',
        transactionFeeValues: [],
        freeTransactionsPerMonth: 0,
        referrerAddress: '',
        exchangeFeePercentage: 0.0,
        transactionsCount: 0,
        password: '',
        firstName: '',
        lastName: '',
        usedReferralCode: '',
        isSuperUser: false,
        walletAddress: '',
        balance: '',
        nonce: '',
        USDBalance: 0,
        CADBalance: 0,
        AUDBalance: 0,
        CHFBalance: 0,
        EURBalance: 0,
        GBPBalance: 0,
        JPYBalance: 0,
        NOKBalance: 0,
        NZDBalance: 0,
        SEKBalance: 0,
        GoldBalance: 0,
        GoldBritanniaBalance: 0,
        GoldSovereignBalance: 0,
        SilverBritanniaBalance: 0,
        SilverBalance: 0,
        PlatinumBalance: 0,
        OilBalance: 0,
        FTSEBalance: 0,
        'S&PBalance': 0,
        EURSTOXXBalance: 0,
        BTCBalance: 0,
        ETHBalance: 0,
        XRPBalance: 0,
        LTCBalance: 0,
        USDConvertedBalance: '',
        CADConvertedBalance: '',
        AUDConvertedBalance: '',
        CHFConvertedBalance: '',
        EURConvertedBalance: '',
        GBPConvertedBalance: '',
        JPYConvertedBalance: '',
        NOKConvertedBalance: '',
        NZDConvertedBalance: '',
        SEKConvertedBalance: '',
        GoldConvertedBalance: '',
        SilverConvertedBalance: '',
        GoldSovereignConvertedBalance: '',
        GoldBritanniaConvertedBalance: '',
        SilverBritanniaConvertedBalance: '',
        PlatinumConvertedBalance: '',
        OilConvertedBalance: '',
        FTSEConvertedBalance: '',
        'S&PConvertedBalance': '',
        EURSTOXXConvertedBalance: '',
        BTCConvertedBalance: '',
        ETHConvertedBalance: '',
        XRPConvertedBalance: '',
        LTCConvertedBalance: '',
        availableReferrals: 0,
        referralCode: '',
        currency: {symbol: 'USD'},
        locales: {},
        userConfirmed: false,
        coords: {
          latitude: 31.907185109980887,
          longitude: -104.11959266290069,
          latitudeDelta: 51.43172567808486,
          longitudeDelta: 66.95441152900457,
        },
        customerId: '',
        encryptedKey: '',
        hashKey: {},
        sources: [],
        firstTime: false,
        kyc: {phone: '', status: null},
        newBalance: 0,
        business: {
          name: 'Loading',
          description: 'Loading...',
          streetAddress: '',
          latitude: 0,
          longitude: 0,
          imageUrl: '',
          phone: '',
          websiteUrl: '',
          categoryId: null,
        },
      };

    // case 'setUserKYC':
    //   return {...user, kyc: {...user.kyc, ...action.payload}};
    case 'setUserCurrency':
      return {...user, currency: action.payload};
    case 'setUserSources':
      return {...user, sources: action.payload};
    case 'setUserKYC1':
      return {...user, kyc: {...user.kyc, ...action.payload}};
    default:
      return user;
  }
}
