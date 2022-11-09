/* eslint-disable react/no-unescaped-entities */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {getState} from 'app/lib/react-simply';
import SafeAreaView from 'react-native-safe-area-view';
import {FullWidthButton} from 'app/components';
import {
  colors,
  containers,
  fonts,
  screenHeight,
  screenWidth,
  percentHeight,
} from 'app/styles';
import Modal from 'react-native-modal';
import Ethereum from 'app/lib/eth';
import * as toast from 'app/lib/toast';
import Joi from 'react-native-joi';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function Bill({navigation}) {
  const today = new Date(Date.now());
  const month = months[today.getMonth()];
  const date = today.getDate();
  const day = today.getDay();
  const formattedDate = `${days[day]}, ${month} ${date}`;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [
    {
      purchase: {amount, currency},
      user,
    },
    dispatch,
  ] = getState();
  const [, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [total, setTotal] = useState(navigation.getParam('total'));
  const selectedSource = useState(navigation.getParam('selectedSource'));

  const handleConfirm = async () => {
    // setLoading(true)
    // const name = `${user.firstName} ${user.lastName}`
    // Ethereum.create(user).then((eth) => {
    //   eth.sendToCashier(amount, name).then((receipt) => {
    //
    //     setLoading(false)
    //     setConfirmed(true)
    //     delay(1000).then(() => setShowBreakdown(true))
    //   }).catch((err) => {
    //     toast.error(err && err.message ? err.message : err)
    //     setLoading(false)
    //   })
    // })
  };

  const chargeSchema = Joi.object().keys({
    amount: Joi.number().integer(),
    currency: Joi.string(),
    source: Joi.string(),
  });

  const handleCCCharge = async () => {
    // setLoading(true)
    // try {
    //   const charge = { amount: total * 100, currency, source: selectedSource }
    //   const result = chargeSchema.validate(charge)
    //   if (result.error) {
    //     throw result.error
    //   }
    //   await api.charge(charge)
    //   await delay(1500)
    //   setLoading(false)
    //   dispatch({ type: 'clearCart' })
    //   navigation.navigate('Club')
    // } catch (err) {
    //   if (err.isJoi) {
    //     const msg = err.details.map((e) => e.message).join('\n')
    //     toast.error(msg)
    //   } else {
    //     toast.error(err)
    //   }
    //   setLoading(false)
    // }
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="" navigation={navigation} />
      <View
        style={containers.screenContainer}
        contentContainerStyle={{marginTop: 15}}
        showsVerticalScrollIndicator={false}>
        {/* <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Bill</Text>
        </View> */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: percentHeight(60),
          }}>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: screenWidth * 0.04,
              color: '#A0A0A0',
            }}>
            Total
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.amount}>{total}</Text>
            <Text style={styles.amount}>{user.currency.symbol}</Text>
          </View>
        </View>

        {/* <TouchableOpacity
          onPress={() => setShowBreakdown(true)}
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: screenWidth * 0.82,
            height: screenWidth * 0.17,
            borderRadius: 7,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 4,
            backgroundColor: colors.bgColor,
            marginTop: screenWidth * 0.1,
            zIndex: 0,
          }}
        >
          <Text style={{
            color: colors.text,
            fontFamily: fonts.muliBold,
            fontSize: screenWidth * 0.045,
            marginHorizontal: '4%',
          }}
          >
            Breakdown
          </Text>
        </TouchableOpacity> */}

        {/* <View style={{
          alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          width: screenWidth * 0.82,
          height: screenWidth * 0.17,
          borderRadius: 7,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 4,
          backgroundColor: colors.bgColor,
          marginTop: screenWidth * 0.05,
          zIndex: 0,
        }}
        >
          <Text style={{
            color: '#DEA037',
            fontFamily: fonts.regular,
            fontSize: screenWidth * 0.032,
            marginHorizontal: '4%',
          }}
          >
            Restaurant Cash
          </Text>
          <Text style={{
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: screenWidth * 0.04,
          }}
          >
            {`**** **** **** ${user.walletAddress.slice(-4)}`}
          </Text>
          <Text
            onPress={() => navigation.navigate('ReloadWallet')}
            style={{
              color: '#DEA037',
              position: 'absolute',
              fontFamily: fonts.regular,
              fontSize: screenWidth * 0.035,
              right: '5%',
            }}
          >
            Change
          </Text>
        </View> */}
        <View
          style={{
            height: screenWidth * 0.25,
            flexDirection: 'row',
            width: screenWidth * 0.8,
            alignSelf: 'center',
            marginTop: 20,
          }}>
          {/* <View style={{ justifyContent: 'center', width: '50%' }}>
            <Text style={{
              fontFamily: fonts.muliBold,
              fontSize: screenWidth * 0.04,
              color: colors.text,
              marginBottom: 10,
            }}
            >
              Taxes
            </Text>
            <Text style={{
              fontFamily: fonts.muliBold,
              fontSize: screenWidth * 0.04,
              color: colors.text,
            }}
            >
              Total
            </Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', width: '50%' }}>
            <Text style={{
              fontFamily: fonts.muliBold,
              fontSize: screenWidth * 0.04,
              color: colors.text,
              marginBottom: 10,
            }}
            >
              0
            </Text>
            <Text style={{
              fontFamily: fonts.muliBold,
              fontSize: screenWidth * 0.04,
              color: colors.text,
            }}
            >
              {`${user.currency.symbol} ${total}`}
            </Text>
          </View> */}
        </View>
      </View>
      {/* <Modal
        isVisible={loading}
        useNativeDriver
        animationIn="flash"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.bgColor} size="large" />
        </View>
      </Modal> */}
      <Modal isVisible={showBreakdown} useNativeDriver>
        <View
          style={{
            height: screenWidth * 1.2,
            width: screenWidth * 0.87,
            alignSelf: 'center',
            backgroundColor: colors.bgColor,
            borderRadius: 10,
            paddingTop: 15,
          }}>
          <TouchableOpacity
            onPress={() => setShowBreakdown(false)}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 5,
              height: screenWidth * 0.12,
              width: screenWidth * 0.12,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fonts.regular,
                fontSize: screenWidth * 0.05,
              }}>
              ✕
            </Text>
          </TouchableOpacity>
          <ScrollView style={{flex: 1, paddingTop: 5}}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>{formattedDate}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: screenWidth * 0.04,
                  color: '#A0A0A0',
                  marginBottom: -screenWidth * 0.02,
                }}>
                Total
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.amount}>782.86</Text>
                <Text style={styles.amount}>{user.currency.symbol}</Text>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: screenWidth * 0.1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: screenWidth * 0.02,
                }}>
                <View style={{width: '55%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: screenWidth * 0.04,
                      color: '#333333',
                    }}>
                    Description
                  </Text>
                </View>
                <View style={{width: '25%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: screenWidth * 0.04,
                      color: '#333333',
                    }}>
                    QTY
                  </Text>
                </View>
                <View style={{width: '20%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: screenWidth * 0.04,
                      color: '#333333',
                    }}>
                    Amount
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: screenWidth * 0.02,
                }}>
                <View style={{width: '55%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    1 Night @ Balehu Restaurant
                  </Text>
                </View>
                <View style={{width: '25%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    3
                  </Text>
                </View>
                <View style={{width: '20%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    $217
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: screenWidth * 0.02,
                }}>
                <View style={{width: '55%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    Room Service
                  </Text>
                </View>
                <View style={{width: '25%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    1
                  </Text>
                </View>
                <View style={{width: '20%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    $99.86
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: screenWidth * 0.02,
                }}>
                <View style={{width: '55%'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    In-Room Movies
                  </Text>
                </View>
                <View style={{width: '25%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    2
                  </Text>
                </View>
                <View style={{width: '20%', alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      fontFamily: fonts.muliBold,
                      fontSize: screenWidth * 0.035,
                      color: '#333333',
                    }}>
                    $16
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: screenWidth * 0.09,
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: screenWidth * 0.04,
                    color: '#333333',
                  }}>
                  Amount Due
                </Text>
              </View>
              <View
                style={{
                  height: screenWidth * 0.08,
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: screenWidth * 0.04,
                    color: '#333333',
                  }}>
                  $782.86
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <FullWidthButton
        title="Submit Payment"
        borderRadius={5}
        width={screenWidth * 0.82}
        height={screenWidth * 0.17}
        titleSize={screenWidth * 0.045}
        onPress={confirmed ? () => setShowBreakdown(true) : handleCCCharge}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfoSubText: {
    color: '#DEA037',
    fontSize: screenWidth * 0.027,
    fontFamily: fonts.regular,
    width: screenWidth * 0.87,
    marginTop: 5,
  },
  userInfoContainer: {
    left: 17,
    marginBottom: 20,
  },
  userInfoText: {
    color: colors.text,
    fontFamily: fonts.muliBold,
    fontSize: screenWidth * 0.045,
    marginRight: 5,
  },
  amount: {
    fontFamily: fonts.muliBold,
    color: '#333333',
    fontSize: screenHeight * 0.075,
  },
  qrContainer: {
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: screenWidth * 0.85,
    width: screenWidth * 0.85,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 20,
  },
});
