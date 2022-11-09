/* eslint-disable react/no-unescaped-entities */
import React, {useState, useEffect} from 'react';
import Joi from 'react-native-joi';
import {View, Text, StyleSheet} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {SubHeader} from 'app/components/Headers';
import {PAIRS} from 'app/lib/constants';
import {getState} from 'app/lib/react-simply';
import {localize} from 'app/lib/currency';
import {
  FullWidthButton,
  ConfirmationListItem,
  CompletedModal,
  ConfirmationSourceListItem,
} from 'app/components';
import {
  colors,
  containers,
  fonts,
  percentHeight,
  percentWidth,
} from 'app/styles';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';

const chargeSchema = Joi.object().keys({
  amount: Joi.number().integer(),
  currency: Joi.string(),
  source: Joi.string(),
});

export default function ConfirmCCPurchase({navigation}) {
  const [
    {
      purchase: {amount, source, currency},
      user,
      currencies,
    },
  ] = getState();
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(0.0);
  const [symbolImage, setSymbolImage] = useState({});
  const [completed, setCompleted] = useState(false);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const determineFee = () => {
    if (currency === 'USD') {
      setFee(parseFloat(amount) * 0.029 + 0.3);
    } else {
      setFee(parseFloat(amount) * 0.014 + 0.2);
    }
  };

  useEffect(() => {
    if (currency) {
      determineFee();
      const {image} = PAIRS.filter(pair => pair.symbol === currency)[0];
      setSymbolImage(image);
    }
  }, [currency]);

  const handleSelectCard = () => navigation.navigate('SelectCreditCard');

  const handleCharge = async () => {
    setLoading(true);
    try {
      const stripeAmount = currency === 'JPY' ? amount : amount * 100;
      const charge = {amount: stripeAmount, currency, source: source.id};
      const result = chargeSchema.validate(charge);
      if (result.error) {
        throw result.error;
      }
      await api.charge(charge);
      await delay(1500);
      setLoading(false);
      setCompleted(true);
    } catch (err) {
      if (err.isJoi) {
        const msg = err.details.map(e => e.message).join('\n');
        toast.error(msg);
      } else {
        toast.error(err);
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      forceInset={{top: 'always', bottom: 'always'}}
      style={{flex: 1}}>
      <SubHeader title="Confirm Purchase" navigation={navigation} />
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
                amount - fee,
                user.locales,
                currencies[currency].decimals,
                0,
              )}
            </Text>
            <Text
              style={[
                styles.character,
                {bottom: percentWidth(1.55)},
              ]}>{` ${currency}`}</Text>
          </View>
        </View>
        <View>
          <ConfirmationSourceListItem
            onPress={handleSelectCard}
            source={source}
          />
          <ConfirmationListItem
            title="Wallet"
            symbol={currency}
            symbolImage={symbolImage}
          />
          <ConfirmationListItem
            title="Amount"
            value={`${localize(
              amount,
              user.locales,
              currencies[currency].decimals,
            )} ${currency}`}
          />
          <ConfirmationListItem
            title="Digitall fee"
            value={`${localize(
              fee,
              user.locales,
              currencies[currency].decimals,
            )} ${currency}`}
          />
          <ConfirmationListItem
            title="Total"
            value={`${localize(
              amount - fee,
              user.locales,
              currencies[currency].decimals,
            )} ${currency}`}
            total
          />
        </View>
        <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
          <FullWidthButton
            onPress={handleCharge}
            title="Confirm Purchase"
            condition={loading || completed}
            loading={loading}
          />
        </View>
      </View>
      <CompletedModal
        completed={completed}
        completedMessage="You're debit card order has been successfully recieved!"
        handleClosePress={() => {
          setCompleted(false);
          navigation.navigate('Wallets', {confirmedCCPurchase: true});
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(12),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentHeight(4),
  },
});
