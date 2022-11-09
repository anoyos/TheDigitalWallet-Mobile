import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {SubHeader} from 'app/components/Headers';
import {PAIRS} from 'app/lib/constants';
import {getState} from 'app/lib/react-simply';
import {localize} from 'app/lib/currency';
import {
  FullWidthButton,
  CompletedModal,
  ConfirmationListItem,
} from 'app/components';
import * as toast from 'app/lib/toast';
import * as api from 'app/lib/api';
import Ethereum from 'app/lib/eth';
import {
  colors,
  containers,
  fonts,
  screenHeight,
  percentWidth,
  percentHeight,
} from 'app/styles';

const cryptoSymbols = ['BTC', 'ETH', 'XRP', 'LTC'];

export default function ConfirmExchange({navigation}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const symbol = navigation.getParam('symbol', false);
  const toCurrency = navigation.getParam('toCurrency', false);
  const fromAmount = navigation.getParam('fromAmount', false);
  const fromAddress = navigation.getParam('fromAddress', false);
  const toAddress = navigation.getParam('toAddress', false);
  const exchangeRate = navigation.getParam('exchangeRate', false);
  const toAmount = navigation.getParam('toAmount', false);
  const nonce = navigation.getParam('nonce', false);
  const sig = navigation.getParam('sig', false);
  const [{user, currencies, contractValues}] = getState();
  const [symbolImage, setSymbolImage] = useState({});
  const [exchangeFeePercentage, setExchangeFeePercentage] = useState(
    user.exchangeFeePercentage + contractValues.priceModifiers[toCurrency],
  );

  useEffect(() => {
    if (
      !user.isSuperUser &&
      (cryptoSymbols.includes(symbol) || cryptoSymbols.includes(toCurrency))
    ) {
      setExchangeFeePercentage(
        contractValues.cryptoExchangeFeeValues +
          contractValues.priceModifiers[toCurrency],
      );
    }
    if (symbol) {
      const {image} = PAIRS.filter(pair => pair.symbol === symbol)[0];
      setSymbolImage(image);
    }
  }, [symbol]);

  const handleConfirmationPress = () => {
    setLoading(true);
    Ethereum.create(user).then(eth => {
      eth.approve(fromAddress, fromAmount).then(() => {
        eth
          .exchange(
            [fromAmount, toAmount, nonce],
            [fromAddress, toAddress],
            sig,
          )
          .then(async () => {
            await api.createNotification({
              aws_user_id: user.id,
              message: `Converted ${localize(
                fromAmount / 10 ** 6,
                user.locales,
                currencies[symbol].decimals,
              )} ${symbol} to ${localize(
                toAmount / 10 ** 6,
                user.locales,
                currencies[toCurrency].decimals,
              )} ${toCurrency}.`,
              payload: JSON.stringify({
                type: 'exchange',
                fromAmount,
                toAmount,
                toCurrency,
              }),
            });
            setLoading(false);
            setCompleted(true);
          })
          .catch(err => {
            toast.error(err && err.message ? err.message : err);
            setLoading(false);
          });
      });
    });
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="Confirm Exchange" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentHeight(23),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <Text style={styles.amount}>
              {localize(
                (toAmount / 10 ** 6) * (1 - exchangeFeePercentage),
                user.locales,
                currencies[toCurrency].decimals,
              )}
            </Text>
            <Text style={styles.character}>{` ${
              currencies[toCurrency].displaySymbol
            }`}</Text>
          </View>
        </View>
        <View>
          <ConfirmationListItem
            title="Wallet"
            symbol={symbol}
            symbolImage={symbolImage}
          />
          <ConfirmationListItem
            title="Amount"
            value={`${localize(
              fromAmount / 10 ** 6,
              user.locales,
              currencies[symbol].decimals,
            )} ${symbol}`}
          />
          <ConfirmationListItem
            title="Exchange rate"
            value={`1 ${symbol} ≈ ${localize(
              exchangeRate,
              user.locales,
              currencies[toCurrency].decimals,
            )} ${toCurrency}`}
          />
          <ConfirmationListItem
            title="Exchange amount"
            value={`${localize(
              toAmount / 10 ** 6,
              user.locales,
              currencies[toCurrency].decimals,
            )} ${toCurrency}`}
          />
          <ConfirmationListItem
            title="Exchange fee"
            fee={`(${exchangeFeePercentage * 100}%)`}
            value={`${localize(
              (toAmount / 10 ** 6) * exchangeFeePercentage,
              user.locales,
              currencies[toCurrency].decimals,
            )} ${toCurrency}`}
          />
          <ConfirmationListItem
            title="Total"
            value={`${localize(
              (toAmount / 10 ** 6) * (1 - exchangeFeePercentage),
              user.locales,
              currencies[toCurrency].decimals,
            )} ${toCurrency}`}
            total
          />
        </View>
        <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
          <FullWidthButton
            onPress={() => handleConfirmationPress()}
            title="Confirm Exchange"
            condition={loading || completed}
            loading={loading}
          />
        </View>
      </View>
      <CompletedModal
        completed={completed}
        completedMessage="You're exchange has been successfully completed!"
        handleClosePress={() => {
          setCompleted(false);
          navigation.popToTop();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: screenHeight * 0.3,
    marginBottom: 10,
  },
  baseContainer: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: screenHeight * 0.09,
    marginBottom: 10,
    flexDirection: 'row',
  },
  toFromContainer: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(12),
  },
  symbol: {
    fontFamily: fonts.muliBold,
    color: colors.text,
    fontSize: percentWidth(4.5),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.04,
  },
  sectionTitle: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: percentHeight(2),
  },
  names: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: percentWidth(8),
  },
  balAmount: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 28,
  },
  toFromText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  toFromAddressText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  memo: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 13,
    paddingTop: 5,
  },
  listItemText: {
    opacity: 0.8,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: percentWidth(4.5),
  },
});
