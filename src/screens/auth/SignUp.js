import Joi from 'react-native-joi';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Switch, Keyboard, Linking} from 'react-native';
import {
  Input,
  FullWidthButton,
  PasswordInput,
  LoadingModal,
} from 'app/components';
import SwitchSelector from 'react-native-switch-selector';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  colors,
  fonts,
  containers,
  percentHeight,
  percentWidth,
} from 'app/styles';
import SafeAreaView from 'react-native-safe-area-view';
import * as toast from 'app/lib/toast';
import {SubHeader} from 'app/components/Headers';
import {getState} from 'app/lib/react-simply';
import {signUp} from '../../lib/auth';
import AccountIcon from 'app/assets/images/account-icon.png';
import MerchantIcon from 'app/assets/images/merchant-icon.png';

const schema = Joi.object()
  .options({
    abortEarly: false,
    stripUnknown: true,
  })
  .keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    username: Joi.string().valid(Joi.ref('email')),
    isCustomer: Joi.boolean(),
    password: Joi.string()
      .min(8)
      .max(60)
      .required(),
    verifyPassword: Joi.string().valid(Joi.ref('password')),
    usedReferralCode: Joi.string().allow(''),
  });

export default function SignUp({navigation}) {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [customer, setCustomer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [oneUppercaseLetter, setOneUppercaseLetter] = useState(false);
  const [eightCharacters, setEightCharacters] = useState(false);
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [message, setMessage] = useState('');
  // Confirmation code is being emailed.
  const [, dispatch] = getState();

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const user = {
        firstName,
        lastName,
        email,
        username: email,
        isCustomer: customer,
        password,
        verifyPassword,
        usedReferralCode: referralCode,
      };
      const {error, value} = schema.validate(user);
      if (error) throw error;
      setMessage('Please Wait Verifing email address');

      signUp(value, setLoading, dispatch, setMessage);
    } catch (err) {
      setLoading(false);

      if (err.isJoi) {
        const msg = err.details.map(e => e.message).join('\n');
        setTimeout(() => {
          toast.error(msg);
        }, 200);
      } else {
        setTimeout(() => {
          toast.error(err);
        }, 200);
      }
    }
  };

  const checkRequirements = (v, setter) => {
    const oneUppercaseLetterRegex = /(?=.*[A-Z])/;
    if (oneUppercaseLetterRegex.test(v)) setOneUppercaseLetter(true);
    else setOneUppercaseLetter(false);

    if (v.length >= 8) setEightCharacters(true);
    else setEightCharacters(false);

    setter(v);
  };
  const switchOptions = [
    {label: '  Customer', value: true, imageIcon: AccountIcon},
    {label: '   Merchant', value: false, imageIcon: MerchantIcon},
  ];

  return (
    <SafeAreaView
      forceInset={{bottom: 'always', top: 'always'}}
      style={{flex: 1}}>
      <SubHeader
        title="Create Account"
        navigation={navigation}
        homeButton={false}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        extraScrollHeight={percentHeight(6)}
        contentContainerStyle={[
          containers.screenContainer,
          {
            marginTop: percentHeight(4),
            alignItems: 'center',
            paddingBottom: percentHeight(20),
          },
        ]}
        enableOnAndroid>
        <Input
          fontSize={percentWidth(4.1)}
          placeholder="First Name"
          onChangeText={value => setFirstName(value)}
          value={firstName}
          autoCorrect={false}
          textContentType="name"
          height={12}
          width={85}
          borderRadius={3}
        />
        <Input
          fontSize={percentWidth(4.1)}
          placeholder="Last Name"
          onChangeText={value => setLastName(value)}
          value={lastName}
          autoCorrect={false}
          textContentType="name"
          height={12}
          width={85}
          borderRadius={3}
        />
        <Input
          fontSize={percentWidth(4.1)}
          placeholder="Email Address"
          onChangeText={value => setEmail(value.trim())}
          value={email.toLowerCase()}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          height={12}
          width={85}
          borderRadius={3}
        />
        <PasswordInput
          placeholder="Password"
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
        <Input
          fontSize={percentWidth(4.1)}
          placeholder="Referral Code"
          onChangeText={value => setReferralCode(value)}
          value={referralCode}
          autoCorrect={false}
          textContentType="name"
          height={12}
          width={85}
          borderRadius={3}
        />
        <View style={{width: percentWidth(80), marginTop: percentHeight(5)}}>
          <SwitchSelector
            initial={0}
            onPress={value => setCustomer(value)}
            textColor={colors.text}
            selectedColor={colors.white}
            buttonColor={colors.primaryColor}
            borderColor={colors.primaryColor}
            fontSize={percentWidth(3.8)}
            hasPadding
            height={percentWidth(12.5)}
            options={switchOptions}
          />
        </View>
        <View style={styles.userAgreement}>
          <View style={{flexDirection: 'row', marginRight: percentWidth(3)}}>
            <Text style={styles.userAgreementText}>I agree to the </Text>
            <Text
              onPress={() =>
                Linking.openURL('http://www.digitall.life/terms-conditions')
              }
              style={[
                styles.userAgreementText,
                {color: 'blue', textDecorationLine: 'underline'},
              ]}>
              Terms and Conditions
            </Text>
            <Text style={styles.userAgreementText}>.</Text>
          </View>
          <View style={{}}>
            <Switch
              value={hasAgreed}
              onValueChange={value => {
                Keyboard.dismiss();
                setHasAgreed(value);
              }}
            />
          </View>
        </View>
        <View style={{height: percentHeight(20)}} />
      </KeyboardAwareScrollView>
      <FullWidthButton
        onPress={handleSignUp}
        bgColor={colors.secondaryColor}
        title="Create Account"
        width={percentWidth(70)}
        titleSize={percentWidth(4.3)}
        height={percentWidth(14)}
        borderRadius={5}
        condition={
          loading
          //   ||
          //   !firstName ||
          //   !lastName ||
          //   !email ||
          //   !password ||
          //   !verifyPassword ||
          //   !hasAgreed ||
          //   !eightCharacters ||
          //   !oneUppercaseLetter
        }
      />
      <LoadingModal loading={loading} loadingMessage={message} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userAgreementText: {
    opacity: 0.8,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAgreement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: percentHeight(8),
  },
});
