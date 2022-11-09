import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {Button} from 'react-native-material-buttons';
import QRCode from 'react-native-qrcode-svg';
import {Icon} from 'react-native-elements';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';
import SafeAreaView from 'react-native-safe-area-view';
import {getState} from 'app/lib/react-simply';
import {MainHeader} from 'app/components/Headers';
import {format, localize} from 'app/lib/currency';
import {FullWidthButton, CompletedModal} from 'app/components';
import {PAIRS} from 'app/lib/constants';
import {
  fonts,
  colors,
  screenHeight,
  screenWidth,
  percentWidth,
  percentHeight,
  containers,
} from 'app/styles';

const SelectItem = ({onPress, image, character, name, symbol}) => (
  <Button
    onPress={onPress}
    shadeBorderRadius={10}
    color="white"
    style={{
      flexDirection: 'row',
      width: percentWidth(75),
      height: percentWidth(10),
      alignSelf: 'center',
      marginVertical: percentWidth(1),
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    }}>
    <View
      style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={image}
        style={{width: percentWidth(8), height: percentWidth(8)}}
      />
    </View>
    <View
      style={{width: '46.66%', justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          fontSize: percentWidth(3.5),
          fontFamily: fonts.semiBold,
          color: colors.text,
        }}>
        {name}
      </Text>
    </View>
    <View
      style={{width: '33.33%', justifyContent: 'center', alignItems: 'center'}}>
      <Text
        style={{
          fontSize: percentWidth(3.5),
          fontFamily: fonts.semiBold,
          color: colors.text,
        }}>
        {character ? `${symbol} (${character})` : `${symbol}`}
      </Text>
    </View>
  </Button>
);

export default function Cashier({navigation}) {
  const [
    {user, currencies, moneyReceived, notifications},
    dispatch,
  ] = getState();
  const [currency, setCurrency] = useState({});
  const [exchangeRate, setExchangeRate] = useState('');
  const [amount, setAmount] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabledDecimal, setDisabledDecimal] = useState(false);
  const [disabledZero, setDisabledZero] = useState(true);
  const [symbol, setSymbol] = useState(user.currency.symbol);
  const qrText = JSON.stringify({
    toAddress: user.walletAddress,
    name: user.business.name,
    toSymbol: symbol,
    toEmail: user.email,
    amount,
  });

  useEffect(() => {
    if (!moneyReceived) return;
    setShowQRCode(false);
    dispatch({type: 'setMoneyReceived', payload: false});
    api
      .createNotification({
        aws_user_id: user.id,
        message: `Payment of ${amount} ${symbol} Successfully Received.`,
        payload: JSON.stringify({
          type: 'payment',
          amount,
          symbol,
        }),
      })
      .then(x => {
        dispatch({
          type: 'addNotification',
          payload: {
            id: x.id,
            read: 0,
            aws_user_id: user.id,
            message: `Payment of ${amount} ${symbol} Successfully Received.`,
            payload: JSON.stringify({
              type: 'payment',
              amount,
              symbol,
            }),
          },
        });
        setAmount('');
      });
  }, [moneyReceived]);

  useEffect(() => {
    if (user.currency.symbol !== symbol) {
      api
        .getExchangeRate({from: symbol, to: user.currency.symbol})
        .then(response => setExchangeRate(response.rate))
        .catch(() => setExchangeRate(''));
    }
    PAIRS.map(pair => {
      if (pair.symbol === symbol) setCurrency(pair);

      return true;
    });
  }, [symbol]);

  const handleDisplayQRCode = async () => {
    if (user.kyc.status === 'verified') return setShowQRCode(true);
    try {
      const remoteKyc = await api.getUserKYC();
      const newKyc = {...user.kyc, ...remoteKyc};
      if (newKyc.status === 'verified') return setShowQRCode(true);
      if (!newKyc.status) return navigation.navigate('KYC');
      if (!newKyc.phoneVerified) return navigation.navigate('KYCPhone');
      switch (newKyc.status) {
        case 'declined':
          return navigation.navigate('KYCDeclined');
        default:
          return navigation.navigate('KYCPending');
      }
    } catch (error) {
      return toast.error(error);
    }
  };

  const handleNumberPress = number => {
    let newNumber;
    if (!number) newNumber = amount.slice(0, -1);
    else newNumber = `${amount}${number}`;
    if (
      (!!newNumber.split('.')[1] &&
        newNumber.split('.')[1].length === currencies[symbol].decimals) ||
      newNumber.length >= 7
    )
      setDisabled(true);
    else setDisabled(false);
    if (newNumber.includes('.')) setDisabledDecimal(true);
    else setDisabledDecimal(false);
    if (newNumber) setDisabledZero(false);
    else setDisabledZero(true);
    setAmount(newNumber);
  };

  const fontSizer = fontSize => {
    if (amount.length === 4) return fontSize * 0.92;
    if (amount.length === 5) return fontSize * 0.86;
    if (amount.length === 6) return fontSize * 0.8;
    if (amount.length === 7) return fontSize * 0.74;
    if (amount.length >= 8) return fontSize * 0.7;
    return fontSize;
  };

  return (
    <>
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        <MainHeader navigation={navigation} admin={user.admin} cashier />
        <View style={containers.screenContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
              <Text
                style={[
                  styles.amount,
                  {fontSize: fontSizer(percentWidth(15))},
                ]}>{`${format(
                amount,
                user.locales,
                currencies[symbol].decimals,
              )}`}</Text>
              <Text
                style={[
                  styles.character,
                  {fontSize: fontSizer(percentWidth(7.5))},
                ]}>{` ${symbol}`}</Text>
            </View>
          </View>
          <Button
            onPress={() => setShowCurrencies(true)}
            color="white"
            style={{
              flexDirection: 'row',
              height: percentHeight(9),
              width: percentWidth(100),
              borderBottomColor: 'rgba(0, 0, 0, 0.1)',
              borderTopColor: 'rgba(0, 0, 0, 0.1)',
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginBottom: percentHeight(1.5),
            }}>
            <View
              style={{
                width: '22%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={currency.image}
                style={{width: percentWidth(9), height: percentWidth(9)}}
              />
            </View>
            <View style={{width: '63%', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: percentWidth(4.1),
                  fontFamily: fonts.regular,
                  color: colors.text,
                }}>
                {`${currency.name} ${
                  currency.character ? `(${currency.character})` : ''
                }`}
              </Text>
              {symbol !== user.currency.symbol && (
                <Text
                  style={{
                    fontSize: percentWidth(3.5),
                    fontFamily: fonts.semiBold,
                    color: 'rgba(0, 0, 0, 0.5)',
                  }}>
                  {/* {user ? `1 ${symbol} ≈ ${localize(exchangeRate, user.locales, currencies[user.currency.symbol].decimals)} ${user.currency.symbol}` : ''} */}
                </Text>
              )}
            </View>
            <View
              style={{
                width: '15%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="chevron-right"
                type="material-community"
                color={colors.lightText}
                size={percentWidth(4)}
              />
            </View>
          </Button>
          <View
            style={{
              height: percentHeight(34),
              width: percentWidth(100),
              flexDirection: 'row',
            }}>
            <View style={styles.outsideColumn}>
              <TouchableOpacity
                onPress={() => handleNumberPress('1')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('4')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('7')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('.')}
                disabled={disabledDecimal}
                style={styles.numberContainer}>
                <Text style={styles.number}>.</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.insideColumn}>
              <TouchableOpacity
                onPress={() => handleNumberPress('2')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('5')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('8')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('0')}
                disabled={disabled || disabledZero}
                style={styles.numberContainer}>
                <Text style={styles.number}>0</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.outsideColumn}>
              <TouchableOpacity
                onPress={() => handleNumberPress('3')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('6')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress('9')}
                disabled={disabled}
                style={styles.numberContainer}>
                <Text style={styles.number}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNumberPress(null)}
                style={styles.numberContainer}>
                <Icon
                  name="backspace"
                  type="material-community"
                  color={colors.text}
                  size={screenHeight * 0.03}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FullWidthButton
            onPress={handleDisplayQRCode}
            condition={!amount || !symbol}
            title="Display QR Code"
          />
        </View>
      </SafeAreaView>
      <Modal isVisible={showQRCode} useNativeDriver>
        <View
          style={{
            bottom: percentWidth(10),
            height: percentWidth(90),
            width: percentWidth(80),
            backgroundColor: 'transparent',
            alignSelf: 'center',
            borderRadius: 15,
          }}>
          <View style={{height: percentWidth(10), alignSelf: 'flex-end'}}>
            <Button color="transparent" onPress={() => setShowQRCode(false)}>
              <Text
                style={{
                  fontSize: percentWidth(5.2),
                  color: 'white',
                  fontFamily: fonts.bold,
                }}>
                Close
              </Text>
            </Button>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: percentWidth(80),
              width: percentWidth(80),
              backgroundColor: 'black',
              alignSelf: 'flex-end',
            }}>
            {!!qrText && (
              <View style={styles.qrContainer}>
                <QRCode value={qrText} size={screenWidth * 0.76} />
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={showCurrencies}
        onBackdropPress={() => setShowCurrencies(false)}
        useNativeDriver
        style={{bottom: percentHeight(4)}}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowCurrencies(false);
          }}>
          <Text
            style={{
              textAlign: 'right',
              color: 'white',
              fontFamily: fonts.bold,
              fontSize: percentWidth(5),
              paddingRight: percentWidth(9),
            }}>
            Close
          </Text>
        </TouchableWithoutFeedback>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentWidth(100),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 15,
          }}>
          <View style={{height: percentWidth(90)}}>
            <Text style={{textAlign: 'center', fontSize: 18, marginBottom: 10}}>
              Select A Currency
            </Text>
            <ScrollView>
              {PAIRS.filter(p => p.name !== '').map(pair => (
                <SelectItem
                  key={`currency-${pair.id}`}
                  onPress={() => {
                    setSymbol(pair.symbol);
                    setShowCurrencies(false);
                  }}
                  image={pair.image}
                  character={pair.character}
                  name={pair.name}
                  symbol={pair.symbol}
                />
              ))}
              <View style={{height: percentHeight(2)}} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <CompletedModal
        completed={completed}
        completedMessage="You have received funds!"
        handleClosePress={() => {
          setCompleted(false);
          navigation.navigate('Wallets');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(15),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(8),
  },
  numberContainer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outsideColumn: {width: '33%'},
  insideColumn: {width: '34%'},
  number: {
    fontFamily: fonts.regular,
    fontSize: percentWidth(7),
    color: colors.text,
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
