import React, {useState, useEffect} from 'react';
import {getState} from 'app/lib/react-simply';
import {View, Text, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  Input,
  PasswordInput,
  FullWidthButton,
  LoadingModal,
} from 'app/components';
import * as toast from 'app/lib/toast';

import {
  login,
  resendConfirmationCode,
  confirmUserForgotPassword,
} from 'app/lib/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SubHeader} from 'app/components/Headers';

import {
  colors,
  fonts,
  screenWidth,
  percentWidth,
  percentHeight,
} from 'app/styles';
import Logo from 'app/assets/images/logo.png';

export default function NewPassword(props) {
  const {navigation} = props;
  const [pin, setPin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oneUppercaseLetter, setOneUppercaseLetter] = useState(false);
  const [eightCharacters, setEightCharacters] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState('');

  const [, dispatch] = getState();

  const handleLogin = async () => {
    if (password !== verifyPassword) {
      toast.error('Confirm Password is not match');
      return;
    }

    setLoading(true);
    const {email} = props.navigation.state.params;
    confirmUserForgotPassword(pin, password, setLoading, navigation, toast);
  };
  const checkRequirements = (v, setter) => {
    const oneUppercaseLetterRegex = /(?=.*[A-Z])/;
    if (oneUppercaseLetterRegex.test(v)) setOneUppercaseLetter(true);
    else setOneUppercaseLetter(false);
    if (v.length >= 8) setEightCharacters(true);
    else setEightCharacters(false);
    setter(v);
  };
  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader navigation={navigation} title="Login" homeButton={false} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        extraScrollHeight={percentHeight(6)}
        contentContainerStyle={{
          paddingTop: percentHeight(15),
          alignItems: 'center',
        }}
        enableOnAndroid>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              height: percentHeight(25),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={Logo}
              style={{
                width: percentWidth(75),
                height: percentWidth(14.36688312),
              }}
            />
            <Text style={{fontSize: 25, marginTop: 10}}>Reset Password</Text>
          </View>
          <View>
            <Input
              fontSize={percentWidth(4.1)}
              placeholder="Enter 6 digit pin code"
              onChangeText={value => setPin(value.trim())}
              value={pin.toLowerCase()}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              height={12}
              width={85}
              borderRadius={3}
            />
          </View>
          <PasswordInput
            placeholder="New Passwor"
            onChangeText={value => checkRequirements(value, setPassword)}
            value={password}
            textContentType="password"
            oneUppercaseLetter={oneUppercaseLetter}
            eightCharacters={eightCharacters}
            validation
            width={85}
          />
          <PasswordInput
            placeholder="Confirm Password"
            onChangeText={value => setVerifyPassword(value)}
            value={verifyPassword}
            textContentType="password"
            width={85}
          />
        </View>
      </KeyboardAwareScrollView>
      <FullWidthButton
        onPress={() => handleLogin()}
        condition={!pin || !password || !verifyPassword}
        title="Reset Password"
        width={percentWidth(60)}
        bgColor={colors.secondaryColor}
        gradient
      />
      <LoadingModal loading={loading} loadingMessage="Logging in..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitleContainer: {
    left: 17,
    paddingTop: 10,
    paddingBottom: 5,
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.muliBold,
    fontSize: screenWidth * 0.037,
  },
  circle: {
    borderRadius: 200,
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    height: screenWidth * 0.55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
