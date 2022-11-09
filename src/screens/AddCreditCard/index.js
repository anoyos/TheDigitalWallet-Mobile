import React, {useState} from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {LiteCreditCardInput} from 'react-native-credit-card-input';
import {getState} from 'app/lib/react-simply';
import SafeAreaView from 'react-native-safe-area-view';
import {SubHeader} from 'app/components/Headers';
import {FullWidthButton} from 'app/components';
import Card from 'app/assets/images/creditcard-red.png';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';
import {colors, containers, percentWidth, percentHeight} from 'app/styles';
import {JS} from '@aws-amplify/core';

// const stripe = require('stripe-client')('pk_test_3oznhJfjqtLyHrsNFnJrO6pN004TGYcLXl')
const stripe = require('stripe-client')(
  'pk_test_51H3JftDCORTl8KZUXZjgCEcd1x3y4ZJvcaksWwvYOkblf34wnrBGxfgu75EZb179Aadx4XYgE7gJN62aZ0LqeCJm00U5gQf5eX',
  // 'pk_live_9JOUVLoGeioRWDJ1xWJPuYyq00i789DPoJ',
);

export default function AddCreditCard({navigation}) {
  const [{user}] = getState();
  const [loading, setLoading] = useState(false);
  const [cardParams, setCardParams] = useState({
    card: {
      valid: false,
      number: 0,
      exp_month: 0,
      exp_year: 0,
      cvc: 0,
      name: `${user.firstName} ${user.lastName}`,
    },
  });

  const handleFieldParamsChange = formData => {
    const {values, valid} = formData;
    setCardParams({
      card: {
        ...cardParams.card,
        valid,
        number: values.number,
        exp_month: parseInt(values.expiry.split('/')[0], 10),
        exp_year: parseInt(values.expiry.split('/')[1], 10),
        cvc: values.cvc,
      },
    });
  };

  const handleAddCreditCard = async () => {
    Keyboard.dismiss();
    // setLoading(true);
    try {
      const input = {...cardParams};
      delete input.card.valid;
      const token = await stripe.createToken(input);
      if (token.card.funding !== 'debit') {
        setLoading(false);
        toast.message('We are currently only accepting debit cards', 75);
      } else {
        await api.saveSource(token.id);
        navigation.navigate('SelectCreditCard');
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setLoading(false);
      toast.error(err);
    }
  };

  return (
    <SafeAreaView
      forceInset={{top: 'always', bottom: 'always'}}
      style={{flex: 1}}>
      <SubHeader title="Add a Card" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentHeight(30),
          }}>
          <Image
            source={Card}
            style={{height: percentHeight(20)}}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            width: percentWidth(95),
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: percentWidth(3),
            paddingVertical: percentWidth(1),
          }}>
          <LiteCreditCardInput
            validColor={colors.text}
            invalidColor="red"
            placeholderColor="darkgray"
            onChange={handleFieldParamsChange}
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={percentWidth(10)}
          style={{flexGrow: 1, justifyContent: 'flex-end'}}>
          <FullWidthButton
            onPress={handleAddCreditCard}
            title="Add Debit Card"
            condition={loading || cardParams.card.cvc === 0}
            loading={loading}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   userInfoContainer: {
//     paddingVertical: 10,
//     justifyContent: 'flex-end',
//   },
//   secondSectionTitle: {
//     paddingVertical: 10,
//     justifyContent: 'flex-end',
//     marginTop: 10,
//     borderBottomColor: colors.lightText,
//     borderBottomWidth: 1,
//   },
//   userInfoText: {
//     left: 17,
//     opacity: 0.6,
//     color: colors.text,
//     fontFamily: fonts.semiBold,
//     fontSize: 15,
//   },
// })
