import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {
  Input,
  PillButton,
  FullWidthButton,
  CountryCodeSelectModal,
} from 'app/components';
import {getState} from 'app/lib/react-simply';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import PhoneNumber from 'awesome-phonenumber';
import {getLocales} from 'react-native-localize';
import {COUNTRY_CODES} from 'app/lib/constants';
import {
  colors,
  fonts,
  screenHeight,
  screenWidth,
  containers,
  percentWidth,
  percentHeight,
  shadow,
} from 'app/styles';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';

export default function KYCFinish({navigation}) {
  const billImage = navigation.getParam('billImage', {});
  const passportImage = navigation.getParam('passportImage', {});
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const localCountryCode = COUNTRY_CODES.find(
    c => getLocales()[0].countryCode === c.code,
  );
  const [countryCode, setCountryCode] = useState(localCountryCode);
  const [ayt, setAyt] = useState(PhoneNumber.getAsYouType(countryCode.code));
  const [countryCodeSearchText, setCountryCodeSearchText] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendPinLoading, setResendPinLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [
    {
      user: {id},
    },
    dispatch,
  ] = getState();

  const modalRef = useRef(null);

  const openModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.open();
    }
  };

  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      modal.close();
    }
  };

  const addKYC = async () => {
    Keyboard.dismiss();
    setLoading(true);

    if (!phone.isPossible()) {
      setLoading(false);
      return toast.message(
        'It appears you have incorrectly typed your number. Please check your number and try again.',
      );
    }

    billImage.fileName = `${id}-bill`;
    passportImage.fileName = `${id}-passport`;

    try {
      await api.addKYC({
        billImage,
        passportImage,
        phone: phone.getNumber('e164'),
        countryCode: countryCode.dial_code,
      });
      dispatch({
        type: 'setUserKYC',
        payload: {
          billImage,
          passportImage,
          phone: phone.getNumber('e164'),
          phoneVerified: false,
          status: 'pending',
          countryCode: countryCode.dial_code,
        },
      });
      await api.sendPhoneRequest();
      setLoading(false);
      setTimeout(() => setShowConfirmModal(true), 100);
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  const sendPin = async () => {
    setResendPinLoading(true);

    try {
      await api.sendPhoneRequest();
      setResendPinLoading(false);
      toast.message('A new pin has been sent!');
    } catch (err) {
      setResendPinLoading(false);
      toast.error(err);
    }
  };

  const handleVerifyPhone = async () => {
    setConfirmLoading(true);
    try {
      await api.verifyPhone({pin});
      dispatch({type: 'setUserKYC', payload: {phoneVerified: true}});
      setShowConfirmModal(false);
      setConfirmLoading(false);
      setTimeout(
        () => navigation.navigate('Wallets', {kycComplete: true}),
        1000,
      );
    } catch (err) {
      setShowConfirmModal(false);
      setConfirmLoading(false);
      setTimeout(() => navigation.navigate('Wallets', {kycError: true}), 1000);
    }
  };

  const updateAyt = code => {
    setFormattedPhone('');
    setAyt(PhoneNumber.getAsYouType(code));
  };

  return (
    <>
      <CountryCodeSelectModal
        closeModal={closeModal}
        modalRef={modalRef}
        updateAyt={updateAyt}
        setCountryCode={setCountryCode}
        countryCodeSearchText={countryCodeSearchText}
        setCountryCodeSearchText={setCountryCodeSearchText}
      />
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        <SubHeader title="AML Compliance" navigation={navigation} />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={containers.screenContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>PHONE NUMBER</Text>
          </View>
          <View style={{width: percentWidth(80), marginLeft: percentWidth(5)}}>
            <Text
              style={{fontSize: percentWidth(4), fontFamily: fonts.regular}}>
              Please select your country code from the menu on the left and then
              write your number in as it is typed in your relevant country.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: percentWidth(85),
              alignSelf: 'center',
              marginTop: percentWidth(5),
            }}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setCountryCodeSearchText('');
                openModal();
              }}
              style={[
                {
                  marginVertical: 4,
                  borderRadius: percentWidth(3),
                  height: percentWidth(10),
                  width: percentWidth(20),
                  borderColor: colors.inputBorder,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                },
              ]}>
              <Text
                style={{
                  borderBottomWidth: 0,
                  color: colors.text,
                  fontFamily: fonts.regular,
                  fontSize: percentWidth(3.5),
                }}>
                {`${countryCode.code} ${countryCode.dial_code}`}
              </Text>
            </TouchableOpacity>
            <View>
              <Input
                fontSize={percentWidth(4.1)}
                placeholder="Mobile Phone #"
                onKeyPress={({nativeEvent: {key: keyValue}}) => {
                  if (formattedPhone.length === 1 && keyValue === 'Backspace') {
                    setAyt(PhoneNumber.getAsYouType(countryCode.code));
                    setFormattedPhone('');
                    setPhone('');
                  }
                }}
                onChangeText={value => {
                  const pn = new PhoneNumber(value, countryCode.code);
                  const n = ayt.reset(value.replace(/\D/g, ''));
                  if (ayt.f.l) {
                    setFormattedPhone(n);
                    setPhone(pn);
                  }
                }}
                value={formattedPhone}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                height={10}
                width={60}
                borderRadius={3}
              />
              <Text
                style={{
                  fontSize: percentWidth(3.8),
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontFamily: fonts.regular,
                }}>
                {`e.g. ${PhoneNumber.getExample(
                  countryCode.code,
                  'mobile',
                ).getNumber('national')}`}
              </Text>
            </View>
          </View>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <FullWidthButton
              loading={loading}
              onPress={addKYC}
              condition={loading}
              title="Verify Phone"
            />
          </View>
        </KeyboardAvoidingView>
        <Modal
          isVisible={showConfirmModal}
          useNativeDriver
          onSwipeComplete={() => setShowConfirmModal(false)}
          swipeThreshold={50}
          swipeDirection={['up', 'down', 'right', 'left']}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: percentWidth(60),
              width: percentWidth(80),
              bottom: percentHeight(10),
              backgroundColor: 'white',
              alignSelf: 'center',
              borderRadius: percentWidth(2),
            }}>
            <View
              style={{
                width: percentWidth(80),
                height: '55%',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -percentWidth(2),
              }}>
              <Input
                placeholder="Enter Pin"
                borderRadius={3}
                keyboardType="phone-pad"
                onChangeText={value => setPin(value)}
                value={pin}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
            <View
              style={{
                height: '30%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {confirmLoading ? (
                <ActivityIndicator color={colors.primaryColor} size="large" />
              ) : (
                <PillButton
                  marginVertical={percentWidth(2)}
                  onPress={() => handleVerifyPhone(pin)}
                  titleSize={percentWidth(3.8)}
                  title="Confirm Phone Number"
                  width={percentWidth(50)}
                  height={percentWidth(10)}
                  gradient
                />
              )}
              <PillButton
                condition={resendPinLoading}
                marginVertical={0}
                onPress={sendPin}
                titleSize={percentWidth(3.8)}
                title="Resend Pin"
                width={percentWidth(30)}
                height={percentWidth(6)}
                // gradient
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
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
  sectionTitleContainer: {
    left: percentWidth(5),
    paddingBottom: percentWidth(2),
    marginTop: percentHeight(6),
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: screenWidth * 0.05,
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
