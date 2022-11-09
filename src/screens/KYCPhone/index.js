import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {Input, PillButton, FullWidthButton} from 'app/components';
import {getState} from 'app/lib/react-simply';
import SafeAreaView from 'react-native-safe-area-view';
import Modal from 'react-native-modal';
import PhoneNumber from 'awesome-phonenumber';
import {
  colors,
  fonts,
  screenHeight,
  screenWidth,
  containers,
  percentWidth,
  percentHeight,
} from 'app/styles';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';

export default function KYCPhone({navigation}) {
  const [{user}, dispatch] = getState();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendPinLoading, setResendPinLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const phone = new PhoneNumber(user.kyc.phone);

  const sendPin = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setResendPinLoading(true);

    try {
      await api.sendPhoneRequest();
      setLoading(false);
      setResendPinLoading(false);
      setTimeout(() => setShowConfirmModal(true), 100);
    } catch (err) {
      setLoading(false);
      setResendPinLoading(false);
      toast.error(err);
    }
  };

  const handleVerifyPhone = async () => {
    setConfirmLoading(true);
    try {
      await api.verifyPhone({pin});
      setShowConfirmModal(false);
      setConfirmLoading(false);
      dispatch({type: 'setUserKYC', payload: {phoneVerified: true}});
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

  return (
    <>
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        <SubHeader title="AML Compliance" navigation={navigation} />
        <View style={containers.screenContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>PHONE NUMBER</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: percentWidth(75),
              alignSelf: 'center',
            }}>
            <View
              style={[
                {
                  marginVertical: 4,
                  borderRadius: percentWidth(3),
                  height: percentWidth(10),
                  width: percentWidth(12),
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
                {user.kyc.countryCode}
              </Text>
            </View>
            <Input
              editable={false}
              fontSize={percentWidth(4.1)}
              value={phone.getNumber('national')}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              height={10}
              width={60}
              borderRadius={3}
            />
          </View>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <FullWidthButton
              loading={loading}
              onPress={sendPin}
              condition={loading}
              title="Verify Phone"
            />
          </View>
        </View>
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
    fontFamily: fonts.muliBold,
    fontSize: screenWidth * 0.037,
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
