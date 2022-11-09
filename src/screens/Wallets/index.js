import React, {useEffect, useState} from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {useFocusState} from 'react-navigation-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {getState} from 'app/lib/react-simply';
import {MainHeader} from 'app/components/Headers';
import ImageSlider from 'react-native-image-slider';
import * as api from 'app/lib/api';
import {Button} from 'react-native-material-buttons';
import * as toast from 'app/lib/toast';
import {SYMBOLS} from 'app/lib/constants';
import {Icon} from 'react-native-elements';
import {useApolloClient, useMutation} from '@apollo/react-hooks';
import {
  updateAttributes,
  refreshCurrentSession,
  checkLoggedIn,
} from 'app/lib/auth';
import {Main} from 'app/assets/images/wallets';
import Ethereum from 'app/lib/eth';
import {localize} from 'app/lib/currency';
import Scene1 from 'app/screens/Wallets/Scene1';
import Scene2 from 'app/screens/Wallets/Scene2';
import Scene3 from 'app/screens/Wallets/Scene3';
import {
  colors,
  percentWidth,
  shadow,
  fonts,
  containers,
  screenWidth,
  percentHeight,
} from 'app/styles';

import Axios from 'axios';

// ignore warnings that start in a string that matchs any of
// the ones in the array
// YellowBox.ignoreWarnings(['User does not exist']);
// console.disableYellowBox = true;
const apiCalls = async (client, dispatch) => {
  try {
    let status = null;
    const {
      data: {kycReview},
    } = await client.query({query: api.GET_KYC_REVIEW});
    if (kycReview.status === 'Init') status = 'init';
    if (kycReview.answer === 'GREEN') status = 'verified';
    dispatch({type: 'setUserKYC', payload: {status}});
  } catch (error) {
    if (error.message === 'GraphQL error: Request failed with status code 404')
      return;
    toast.error(error);
  }
  try {
    const notifications = await api.getNotifications();
    dispatch({type: 'setNotifications', payload: notifications});
  } catch (error) {
    toast.error(error);
  }
  try {
    const sentReferrals = await api.getReferrals();
    const pendingReferrals = await api.getPendingReferrals();
    dispatch({
      type: 'setReferrals',
      payload: {pendingReferrals, sentReferrals},
    });
  } catch (error) {
    toast.error(error);
  }
  try {
    const pendingGiftCards = await api.getPendingGiftCards();
    dispatch({type: 'setPendingGiftCards', payload: pendingGiftCards});
  } catch (error) {
    toast.error(error);
  }
  try {
    const acceptedGiftCards = await api.getAcceptedGiftCards();
    dispatch({type: 'setAcceptedGiftCards', payload: acceptedGiftCards});
  } catch (error) {
    toast.error(error);
  }
  try {
    const transactions = await api.getUserTransactions();
    dispatch({type: 'setTransactions', payload: transactions});
  } catch (error) {
    toast.error(error);
  }
  // try {
  //   const bankAccounts = await api.getBankAccounts();
  //   dispatch({type: 'setBankAccounts', payload: bankAccounts});
  // } catch (error) {
  //   console.log('setBankAccounts-----', error);

  //   toast.error(error);
  // }
};

const usersContractCalls = async user => {
  const eth = await Ethereum.create(user);

  const isSuperUser = await eth.isSuperUser(user.walletAddress);

  const transactionFeeValues = await eth.getTransactionFeeValues(
    user.walletAddress,
  );

  const exchangeFeeValues = await eth.getExchangeFeeValues(user.walletAddress);

  const referrerAddress = await eth.getReferrerAddress(user.walletAddress);

  const remainingFreeTransactions = await eth.getRemainingFreeTransactions(
    user.walletAddress,
  );

  const flatFeeValues = await eth.getFlatFeeValues();

  const purchaseWithCreditCardFeeValues = await eth.getPurchaseWithCreditCardFeeValues();

  const purchaseWithCryptoFeeValues = await eth.getPurchaseWithCryptoFeeValues();

  const purchaseWithEurCreditCardFeeValues = await eth.getPurchaseWithEurCreditCardFeeValues();
  const storageFeeValues = await eth.getStorageFeeValues();
  const priceModifiers = await eth.getPriceModifiers();
  const cryptoExchangeFeeValues = await eth.getCryptoExchangeFeeValues();
  const percentage =
    exchangeFeeValues.length === 2
      ? parseInt(exchangeFeeValues[0], 10) / parseInt(exchangeFeeValues[1], 10)
      : 0.0;

  const contractValues = {
    flatFeeValues,
    purchaseWithCreditCardFeeValues,
    purchaseWithCryptoFeeValues,
    purchaseWithEurCreditCardFeeValues,
    storageFeeValues,
    priceModifiers,
    cryptoExchangeFeeValues,
  };

  return {
    userValues: {
      isSuperUser,
      transactionFeeValues: isSuperUser ? [0, 1] : transactionFeeValues,
      exchangeFeePercentage: isSuperUser ? 0.0 : percentage,
      referrerAddress,
      remainingFreeTransactions,
    },
    contractValues,
  };
};

/* eslint-disable */
const getEthBalances = async (
  symbols,
  user,
  timer,
  setLoading,
  client,
  dispatch,
) => {
  let balance;
  const payload = {};
  if (Object.keys(user.hashKey).length === 0) return payload;

  try {
    // xyz1
    const eth = await Ethereum.create(user);
    for (const item of symbols) {
      if (user.superAdmin) balance = await eth.contractBalance(item);
      else balance = (await eth.getBalance(item)) / 10 ** 6;

      // if (balance != user[`${item}Balance`])
      payload[`${item}Balance`] = balance;
      // console.log(payload[`${item}Balance`]);
      console.log(`${item}: ` + balance);
    }
    // console.log('payload123===', payload);
    return payload;
  } catch (err) {
    checkLoggedIn(timer, setLoading, client, dispatch);
  }
};
const formatToCurrency = amount => {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
const convertBalances = async (user, dispatch, setTotal, setLoading) => {
  setLoading(true);
  let tot = 0;
  const payload = {};

  for (const item of SYMBOLS) {
    if (item === user.currency.symbol) {
      tot += user[`${item}Balance`];
      payload[`${item}ConvertedBalance`] = user[`${item}Balance`];
    } else if (user[`${item}Balance`] > 0) {
      try {
        const symbol = item === 'GOLD' ? 'PAXG' : item;
        const result = await Axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${
            user.currency.symbol
          }`,
        );
        // alert(JSON.stringify(result));
        // const { toAmount } = await api.convertCurrencies({
        //   from: item,
        //   to: user.currency.symbol,
        //   amount: parseFloat(user[`${item}Balance`]),
        // });

        tot +=
          result.data[user.currency.symbol] *
          parseFloat(user[`${item}Balance`]);
        payload[`${item}ConvertedBalance`] = toAmount;
      } catch (error) {
        toast.error(error);
      }
    }
  }
  dispatch({type: 'setUser', payload});
  setTotal(formatToCurrency(tot));
};
/* eslint-enable */

export default function Wallets({navigation}) {
  const client = useApolloClient();
  const [total, setTotal] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [displayTotal, setdisplayTotal] = useState(0);
  const [defaultCurrency, setDefaultCurrency] = useState('');

  const [loadedconversion, setLoadingConversion] = useState(false);

  const [loadedBalances, setLoadedBalances] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const confirmedCCPurchase = navigation.getParam('confirmedCCPurchase', false);
  const kycComplete = navigation.getParam('kycComplete', false);
  const kycError = navigation.getParam('kycError', false);
  const [
    {user, timer, currencies, notifications: stateNotifications},
    dispatch,
  ] = getState();
  const {isFocused} = useFocusState();
  const [useReferralCode] = useMutation(api.USE_REFERRAL_CODE);
  const [addUser] = useMutation(api.ADD_USER);

  const scenes = [
    {id: 0, component: Scene1},
    {id: 1, component: Scene2},
    {id: 2, component: Scene3},
  ];

  // first time
  useEffect(() => {
    setNewBalance(user.newBalance);
    if (!user.firstTime) return;
    addUser()
      .then(() => console.log('User added to db.')) // eslint-disable-line no-console
      .catch(err => {
        console.log('User added to d', err);
        toast.error(err);
      });
    if (user.usedReferralCode) {
      useReferralCode({variables: {referralCode: user.usedReferralCode}})
        .then(() => console.log('Referral code used.')) // eslint-disable-line no-console
        .catch(err => {
          console.log('Referral code used', err);
          toast.error(err);
        });
    }
    dispatch({type: 'setUser', payload: {firstTime: false}});
  }, []);

  // initial loadp
  useEffect(() => {
    api
      .isReferred()
      .then(async ({referred, referrerEmail}) => {
        if (referred) {
          await api.createNotification({
            aws_user_id: user.id,
            message: `Please accept or decline ${referrerEmail} referral.`,
            payload: JSON.stringify({
              type: 'referral',
              referrerEmail,
            }),
          });
        }
      })
      .catch(err => {
        toast.error(err);
      });
    if (!user.customerId) {
      api
        .getCustomerId()
        .then(async customer => {
          const newUser = {
            ...JSON.parse(await AsyncStorage.getItem('user')),
            customerId: customer.stripe_customer_id,
          };
          const stringUser = JSON.stringify(newUser);
          await AsyncStorage.setItem('user', stringUser);
          updateAttributes(
            {
              attributes: [
                {
                  Name: 'custom:stripe_customer_id',
                  Value: customer.stripe_customer_id,
                },
              ],
            },
            () => {
              refreshCurrentSession(() => {
                dispatch({
                  type: 'setUser',
                  payload: {customerId: customer.stripe_customer_id},
                });
              });
            },
          );
        })
        .catch(err => {
          toast.error(err);
        });
    } else {
      api
        .getSources()
        .then(({sources: {data}}) => {
          dispatch({type: 'setUser', payload: {sources: data}});
        })
        .catch(err => {
          toast.error(err);
        });
    }
    if (user.admin) {
      api
        .getBusiness()
        .then(business => {
          dispatch({type: 'setUser', payload: {business}});
        })
        .catch(err => {
          toast.error(err);
        });
    }
    apiCalls(client, dispatch);
    api
      .getBusinesses()
      .then(payload => dispatch({type: 'setBusinesses', payload}))
      .then(() => dispatch({type: 'setDistances', payload: user.coords}))
      .catch(err => {
        toast.error(err);
      });

    usersContractCalls(user).then(({userValues, contractValues}) => {
      getEthBalances(SYMBOLS, user, timer, setLoading, client, dispatch).then(
        payload => {
          // console.log('payload======', payload);
          dispatch({type: 'setUser', payload: {...payload, ...userValues}});
          dispatch({type: 'setContractValues', payload: contractValues});
          delay(1000).then(() => setLoadedBalances(true));
        },
      );
    });
  }, []);

  // fired everytime screen is focused
  useEffect(() => {
    if (!isFocused) return;
    dispatch({type: 'clearTransfer'});
    if (confirmedCCPurchase) {
      navigation.setParams({confirmedCCPurchase: false});
      toast.message('Debit Card transaction is processing.');
    }
    if (kycComplete) {
      navigation.setParams({kycComplete: false});
      toast.message('You have completed the KYC process!');
    }
    if (kycError) {
      navigation.setParams({kycError: false});
      toast.message(
        'Unable to process KYC at this time. \n Please try again later. ',
      );
    }
  }, [isFocused]);

  // initial convert and total after balances are loaded
  useEffect(() => {
    if (!loadedBalances) return;
    setLoading(true);
    convertBalances(user, dispatch, setTotal, setLoading)
      .then(() => {})
      .catch(err => {
        console.log('convertBalances', err);
        toast.error(err);
      })
      .finally(() => setLoading(false));
    setInitialized(true);
  }, [loadedBalances]);

  useEffect(() => {
    clearInterval(timer.id2);
    const id2 = setInterval(async () => {
      try {
        const notifications = await api.getNotifications();
        alert(notifications.length);
        if (notifications.length !== stateNotifications.length) {
          dispatch({type: 'setNotifications', payload: notifications});
        }
      } catch (err) {
        console.log('setNotifications', err);
        // zohaib reload loader
        // checkLoggedIn(timer, setLoading, client, dispatch);
      } // eslint-disable-line no-console
    }, 7000);
    dispatch({type: 'setTimer', payload: {id2}});

    return () => clearInterval(id2); // eslint-disable-line consistent-return
  }, [stateNotifications]);

  const convertBalance = currentcy => {
    return currentcy > 0 ? currentcy : 0;
  };

  useEffect(() => {
    if (!loadedBalances) return;
    setLoading(true);
    convertBalances(user, dispatch, setTotal, setLoading)
      .then(() => {})
      .catch(err => {
        console.log('convertBalances', err);
        toast.error(err);
      })
      .finally(() => setLoading(false));
    setInitialized(true);
  }, [
    user.USD,
    user.SP,
    user.FTSE,
    user.EURSTOXX,
    user.GBP,
    user.Gold,
    user.GoldBritanniaBalance,
    user.Silver,
    user.SilverBritanniaBalance,
    user.CAD,
    user.EUR,
    user.JPY,
    user.CHF,
    user.ETH,
    user.BTC,
    user.currency,
    user.PlatinumBalance,
  ]);

  return (
    <View forceInset={{top: 'always'}} style={{flex: 1}}>
      <StatusBar backgroundColor={colors.bgColor} barStyle="dark-content" />
      <MainHeader navigation={navigation} admin={user.admin} />
      <View style={containers.screenContainer}>
        <View
          style={{
            // top: percentWidth(10),
            // backgroundColor: colors.primaryColor,
            position: 'absolute',
            zIndex: 4,
            height: percentWidth(45),
            width: percentWidth(100),
          }}
        />
        <Button
          // onPress={() => convertBalanceApi()}
          onPress={() => navigation.navigate('DefaultCurrency')}
          color="transparent"
          style={styles.walletTotalContainer}>
          <View style={styles.walletTotalTextContainer}>
            <Text style={styles.walletTotalText}>WALLET TOTAL</Text>
            {loadedconversion ? (
              <ActivityIndicator
                color={colors.bgColor}
                size="large"
                style={[styles.totalBalance]}
              />
            ) : (
              <Text style={styles.totalBalance}>
                {total} {user.currency.symbol}
              </Text>
            )}

            {/* {loading ? (
              <ActivityIndicator
                color={colors.bgColor}
                size="large"
                style={[styles.totalBalance]}
              />
            ) : (
              <Text style={styles.totalBalance}>{displayTotal}</Text>
              // <Text style={styles.totalBalance}>
              //   {' '}
              //   Live balance will be available soon{' '}
              // </Text>
            )} */}
            <Image
              source={Main}
              style={{
                width: percentWidth(98),
                height: percentWidth(39.1621621608),
                alignSelf: 'center',
              }}
            />
          </View>
        </Button>
        <ImageSlider
          images={scenes}
          style={{flex: 1, backgroundColor: colors.bgColor}}
          customSlide={({index, item, style, width}) => (
            <item.component key={index} style={style} width={width} />
          )}
          customButtons={(position, move) => (
            <>
              {position > 0 && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => move(position - 1)}>
                  <Icon
                    name="arrow-left"
                    style={{...shadow}}
                    type="font-awesome"
                    color={colors.buttonText}
                    size={percentWidth(4)}
                  />
                </TouchableOpacity>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: percentHeight(4),
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                {scenes.map((item, index) => (
                  <Button
                    key={item.id}
                    shadeBorderRadius={50}
                    onPress={() => move(index)}
                    style={
                      position === index ? styles.circleSelected : styles.circle
                    }
                  />
                ))}
              </View>
              {position < 2 && (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => move(position + 1)}>
                  <Icon
                    name="arrow-right"
                    style={{...shadow}}
                    type="font-awesome"
                    color={colors.buttonText}
                    size={percentWidth(4)}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  walletTotalContainer: {
    width: percentWidth(97),
    height: percentWidth(38.7625482612),
    top: percentWidth(11),
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  walletTotalTextContainer: {
    width: percentWidth(96.5),
    height: percentWidth(38.5627413114),
    overflow: 'hidden',
    zIndex: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: 'rgb(108,108,108)',
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    borderRadius: 50,
    marginHorizontal: percentWidth(1),
  },
  circleSelected: {
    backgroundColor: colors.secondaryColor,
    width: screenWidth * 0.05,
    height: screenWidth * 0.05,
    borderRadius: 50,
    marginHorizontal: percentWidth(1),
  },
  walletTotalText: {
    position: 'absolute',
    fontFamily: fonts.avenirBold,
    fontSize: percentWidth(4.2),
    top: percentWidth(10),
    color: '#FFFFFF',
    zIndex: 1,
  },
  totalBalance: {
    textAlign: 'center',
    position: 'absolute',
    fontFamily: fonts.bold,
    fontSize: percentWidth(7),
    bottom: percentWidth(12),
    color: '#FFFFFF',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    width: percentWidth(9),
    height: percentWidth(9),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryColor,
    bottom: percentWidth(5),
    left: percentWidth(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  nextButton: {
    position: 'absolute',
    width: percentWidth(9),
    height: percentWidth(9),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondaryColor,
    bottom: percentWidth(5),
    right: percentWidth(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoContainer: {
    width: screenWidth * 0.55,
    paddingLeft: screenWidth * 0.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: percentWidth(1.5),
  },
  sideContainer: {
    width: percentWidth(15),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: percentWidth(0.5),
  },
  button: {
    width: percentWidth(8),
    height: percentWidth(8),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
