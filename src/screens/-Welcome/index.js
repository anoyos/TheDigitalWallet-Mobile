/* eslint-disable max-len */
import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import {FullWidthButton} from 'app/components';
import {getState} from 'app/lib/react-simply';
import {Button} from 'react-native-material-buttons';
import {useFocusState} from 'react-navigation-hooks';
import {
  colors,
  fonts,
  screenWidth,
  screenHeight,
  percentWidth,
} from 'app/styles';
import Logo from 'app/assets/images/logo.png';

export default function Welcome({navigation: {navigate}}) {
  const [{timer}] = getState();
  const {isFocused} = useFocusState();

  useEffect(() => {
    if (!isFocused) return;
    clearInterval(timer.id1);
    clearInterval(timer.id2);
  }, [isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: colors.bgColor}}>
      <StatusBar backgroundColor={colors.bgColor} barStyle="dark-content" />
      <View
        style={{height: '70%', alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={Logo}
          style={{width: percentWidth(75), height: percentWidth(14.36688312)}}
        />
      </View>
      <View style={{flex: 1}}>
        <FullWidthButton title="Sign Up" onPress={() => navigate('SignUp')} />
        <View style={styles.signInContainer}>
          <Text style={styles.accountText}>Already have an account?</Text>
          <Button
            onPress={() => navigate('Login')}
            color="transparent"
            shadeBorderRadius={percentWidth(5)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: percentWidth(30),
              height: percentWidth(10),
              borderRadius: percentWidth(5),
            }}>
            <Text style={[styles.signInText, {color: colors.secondaryColor}]}>
              Sign In ok
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    top: -screenHeight * 0.01,
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
    borderRadius: 10,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    borderRadius: 10,
  },
  landerButton: {
    margin: 2,
    width: 7,
    height: 7,
    borderRadius: 8 / 2,
    backgroundColor: 'rgba(137,134,227,0.41)',
    opacity: 0.9,
  },
  landerSelectedButton: {
    marginTop: 1,
    opacity: 1,
    width: 9,
    height: 9,
    borderRadius: 8 / 2,
    backgroundColor: '#CF68EB',
  },
  titleText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 49,
    letterSpacing: -1.13,
  },
  signInContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontFamily: fonts.regular,
    opacity: 0.8,
    color: colors.text,
    fontSize: 14,
  },
  signInText: {
    fontSize: percentWidth(4.1),
    textDecorationLine: 'underline',
    fontFamily: fonts.regular,
  },
  termsAndPrivacyLightText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    opacity: 0.8,
    color: colors.text,
  },
  termsAndPrivacyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  modalTextContainer: {
    width: '95%',
    alignSelf: 'center',
  },
  boldText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
    padding: 5,
  },
  underlineText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    textDecorationLine: 'underline',
    paddingTop: 5,
    paddingLeft: 5,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    padding: 5,
  },
});
