import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {FullWidthButton, Input} from 'app/components';
import SafeAreaView from 'react-native-safe-area-view';
import {SubHeader} from 'app/components/Headers';
import {
  percentWidth,
  percentHeight,
  colors,
  fonts,
  screenWidth,
  containers,
} from 'app/styles';
import * as api from 'app/lib/api';
import {Icon} from 'react-native-elements';
import {TextInputMask} from 'react-native-masked-text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getState} from 'app/lib/react-simply';

export default function EditBankAccount({navigation}) {
  const [{}, dispatch] = getState();
  const id = navigation.getParam('id');
  const [accountNumber, setAccountNumber] = useState(
    navigation.getParam('accountNumber'),
  );
  const [sortCode, setSortCode] = useState(navigation.getParam('sortCode'));
  const [IBAN, setIBAN] = useState(navigation.getParam('IBAN'));
  const [SWIFT, setSWIFT] = useState(navigation.getParam('swift'));
  const [reference, setReference] = useState(navigation.getParam('reference'));

  const sortCodeRef = useRef(null);
  const ibanRef = useRef(null);

  const handleUpdateBankAccount = async () => {
    const rawSortCode = sortCodeRef.current.getRawValue();
    const rawIBAN = ibanRef.current.getRawValue();
    const bankAccount = {
      id,
      accountNumber,
      sortCode: rawSortCode,
      iban: rawIBAN,
      swift: SWIFT,
      reference,
    };
    const {result} = await api.updateBankAccount(bankAccount);
    if (result === 1) {
      dispatch({type: 'updateBankAccount', payload: bankAccount});
      navigation.goBack();
    }
  };

  const handleRemoveBankAccount = async () => {
    try {
      const {result} = await api.removeBankAccount({id});
      if (result === 1) {
        dispatch({type: 'removeBankAccount', payload: id});
        navigation.goBack();
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView
      forceInset={{top: 'always', bottom: percentHeight(3)}}
      style={{flex: 1}}>
      <SubHeader title="Edit Bank Account" navigation={navigation} />
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        style={containers.screenContainer}>
        <View
          style={{
            height: '18%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            raised
            type="font-awesome"
            name="edit"
            color={colors.secondaryColor}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{fontFamily: fonts.avenirBold, fontSize: percentWidth(4.5)}}>
            Bank Details
          </Text>
        </View>
        <View
          style={{
            height: percentHeight(45),
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: percentWidth(10),
          }}>
          <Input
            keyboardType="number-pad"
            returnKeyType="done"
            fontSize={percentWidth(4.1)}
            placeholder="Account Number"
            onChangeText={value => setAccountNumber(value)}
            value={accountNumber}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            maxLength={17}
          />
          <TextInputMask
            ref={sortCodeRef}
            fontSize={percentWidth(4.1)}
            placeholder="Sort Code"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{
              mask: '99-99-99',
              getRawValue: value => value.replace(/-+/g, ''),
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            onChangeText={value => setSortCode(value)}
            value={sortCode}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={{
              fontSize: percentWidth(4.1),
              color: colors.text,
              fontFamily: fonts.regular,
              justifyContent: 'center',
              marginVertical: 4,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: percentWidth(3),
              height: percentWidth(12),
              width: percentWidth(80),
              paddingLeft: percentWidth(5),
              paddingRight: percentWidth(5),
              paddingTop: percentWidth(2),
              paddingBottom: percentWidth(2),
            }}
          />
          <TextInputMask
            ref={ibanRef}
            fontSize={percentWidth(4.1)}
            placeholder="IBAN"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{
              mask: 'SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS SSSS',
              getRawValue: value => value.replace(/\s+/g, ''),
            }}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            onChangeText={value => setIBAN(value.toUpperCase())}
            value={IBAN}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={{
              fontSize: percentWidth(4.1),
              color: colors.text,
              fontFamily: fonts.regular,
              justifyContent: 'center',
              marginVertical: 4,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: percentWidth(3),
              height: percentWidth(12),
              width: percentWidth(80),
              paddingLeft: percentWidth(5),
              paddingRight: percentWidth(5),
              paddingTop: percentWidth(2),
              paddingBottom: percentWidth(2),
            }}
          />
          <TextInputMask
            fontSize={percentWidth(4.1)}
            placeholder="SWIFT"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{mask: 'SSSSSSSSSSS'}}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            onChangeText={value => setSWIFT(value.toUpperCase())}
            value={SWIFT}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={{
              fontSize: percentWidth(4.1),
              color: colors.text,
              fontFamily: fonts.regular,
              justifyContent: 'center',
              marginVertical: 4,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: percentWidth(3),
              height: percentWidth(12),
              width: percentWidth(80),
              paddingLeft: percentWidth(5),
              paddingRight: percentWidth(5),
              paddingTop: percentWidth(2),
              paddingBottom: percentWidth(2),
            }}
          />
          <TextInputMask
            fontSize={percentWidth(4.1)}
            placeholder="Reference"
            placeholderTextColor={colors.lightText}
            type="custom"
            options={{mask: 'SSSSSSSSSSSSSSSSSSSSSSSSS'}}
            keyboardType="name-phone-pad"
            returnKeyType="done"
            onChangeText={value => setReference(value.toUpperCase())}
            value={reference}
            autoCorrect={false}
            height={12}
            width={80}
            borderRadius={3}
            borderWidth={0}
            style={{
              fontSize: percentWidth(4.1),
              color: colors.text,
              fontFamily: fonts.regular,
              justifyContent: 'center',
              marginVertical: 4,
              borderColor: colors.inputBorder,
              borderWidth: 1,
              borderRadius: percentWidth(3),
              height: percentWidth(12),
              width: percentWidth(80),
              paddingLeft: percentWidth(5),
              paddingRight: percentWidth(5),
              paddingTop: percentWidth(2),
              paddingBottom: percentWidth(2),
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleRemoveBankAccount}
          style={{marginTop: percentHeight(4.1)}}>
          <Text
            style={{
              color: colors.lightText,
              textAlign: 'center',
              fontSize: percentWidth(4.1),
            }}>
            Remove Account
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <FullWidthButton
        condition={!accountNumber || !sortCode || !IBAN || !SWIFT || !reference}
        onPress={handleUpdateBankAccount}
        gradient
        title="Update"
        width={screenWidth * 0.7}
        titleSize={percentWidth(4.3)}
        height={screenWidth * 0.14}
        borderRadius={5}
      />
    </SafeAreaView>
  );
}
