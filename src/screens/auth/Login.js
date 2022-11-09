import React, {useState, useEffect} from 'react';
import {getState} from 'app/lib/react-simply';
import {View, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  Input,
  PasswordInput,
  FullWidthButton,
  LoadingModal,
} from 'app/components';
import {
  checkBuffer,
  generateEthUserData,
  generateReferralCode,
  getCurrency,
} from 'app/lib/auth/utils';

import {localize} from 'app/lib/currency';
import {login, resendConfirmationCode, userForgotPassword} from 'app/lib/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SubHeader} from 'app/components/Headers';
import * as toast from 'app/lib/toast';
import * as Keychain from 'react-native-keychain';
import {
  colors,
  fonts,
  screenWidth,
  percentWidth,
  percentHeight,
} from 'app/styles';
import Logo from 'app/assets/images/logo.png';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, dispatch] = getState();

  useEffect(() => {
    Keychain.getGenericPassword()
      .then(credentials => {
        // alert(credentials.username);
        // if (credentials.username) setEmail(credentials.username);
        if (credentials.username) navigation.navigate('Wallets');
      })
      .catch(err => toast.error(err));
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    login(
      {username: email, password},
      setLoading,
      dispatch,
      ({isCustomer, error}) => {
        try {
          if (error) throw error;
          if (!isCustomer) navigation.navigate('Cashier');
          else navigation.navigate('Wallets');
        } catch (e) {
          setLoading(false);
          if (error.code == 'NotAuthorizedException') {
            alert(error.message);
            return;
          }
          if (error.code == 'UserNotFoundException') {
            alert(error.message);
            return;
          }

          if (error.code === 'UserNotConfirmedException') {
            resendConfirmationCode({username: email, password}, setLoading);
          } else {
            if (e.code == 'PasswordResetRequiredException') {
              userForgotPassword(email, (error, result) => {
                setLoading(false);

                if (error) {
                  // alert(JSON.stringify(error.message));

                  return;
                } else {
                  if (result) {
                    // alert(
                    //   'Reset Password Required. Please check your email for the verification code.',
                    // );
                    // return navigation.navigate('NewPassword', {email});
                  }
                }
              });
            }
            // setTimeout(() => {
            toast.info(
              'Reset Password Required. Please check your email for the verification code.',
            );
            navigation.navigate('NewPassword', {email});
            // }, 500);
            // toast.error(e);
            // alert(e.message);
          }
        }
      },
    );
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
          </View>
          <View>
            <Input
              fontSize={percentWidth(4.1)}
              placeholder="Email"
              onChangeText={value => setEmail(value.trim())}
              value={email.toLowerCase()}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              height={12}
              width={85}
              borderRadius={3}
            />
          </View>
          <View style={{marginTop: percentWidth(2)}}>
            <PasswordInput
              placeholder="Password"
              onChangeText={value => setPassword(value)}
              value={password}
              textContentType="password"
              width={85}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <FullWidthButton
        onPress={() => handleLogin()}
        condition={!email || !password}
        title="Sign In"
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
