import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {Icon} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import {TitleOnlyHeader} from 'app/components/Headers';
import {useApolloClient} from '@apollo/react-hooks';
import {useFocusState} from 'react-navigation-hooks';
import {getState} from 'app/lib/react-simply';
import TouchID from 'react-native-touch-id';
import {signOut} from 'app/lib/auth';
import {useAnimation} from 'react-native-animation-hooks';
import {
  colors,
  screenHeight,
  fonts,
  percentWidth,
  containers,
  percentHeight,
} from 'app/styles';

export default function EnterPin({navigation}) {
  const client = useApolloClient();
  const [pin, setPin] = useState('');
  const [initialLoadCompolete, setInitialLoadCompolete] = useState(false);
  const [touchIdSupported, setTouchIdSupported] = useState(false);
  const {isFocused} = useFocusState();
  const [{user, timer}, dispatch] = getState();

  const authenticate = () =>
    TouchID.authenticate()
      .then(() => navigation.navigate('App'))
      .catch(error => {
        // eslint-disable-next-line no-console
      });

  useEffect(() => {
    if (!initialLoadCompolete) return;
    if (pin === user.pin) navigation.navigate('App');
    else if (pin.length === 6)
      setTimeout(() => handleNumberPress('reset'), 200);
  }, [pin]);

  useEffect(() => {
    if (!isFocused) return;
    clearInterval(timer.id1);
    clearInterval(timer.id2);
    TouchID.isSupported()
      .then(() => setTouchIdSupported(true))
      // eslint-disable-next-line no-console
      .catch(error => console.log(error));
    setInitialLoadCompolete(true);
  }, [isFocused]);

  const handleNumberPress = number => {
    let newNumber;
    if (!number) newNumber = pin.slice(0, -1);
    else newNumber = `${pin}${number}`;
    if (number === 'reset') newNumber = '';
    setPin(newNumber);
  };

  const animatedValues = digit => ({
    type: 'spring',
    initialValue: 1,
    toValue: digit && pin.charAt(digit) ? 1.1 : 1,
    duration: 100,
    useNativeDriver: true,
  });

  const firstDigitAnimatedValue = useAnimation(animatedValues(0));
  const secondDigitAnimatedValue = useAnimation(animatedValues(1));
  const thirdDigitAnimatedValue = useAnimation(animatedValues(2));
  const fourthDigitAnimatedValue = useAnimation(animatedValues(3));
  const fifthDigitAnimatedValue = useAnimation(animatedValues(4));
  const sixthDigitAnimatedValue = useAnimation(animatedValues(5));

  const animatedStyle = value => ({
    transform: [
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  });

  const Circle = ({digit, animatedValue}) => (
    <Animated.View
      style={{
        height: percentWidth(7),
        width: percentWidth(7),
        marginHorizontal: percentWidth(1),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.primaryColor,
        backgroundColor: pin.charAt(digit)
          ? colors.primaryColor
          : colors.bgColor,
        ...animatedStyle(animatedValue),
      }}
    />
  );

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <StatusBar backgroundColor={colors.bgColor} barStyle="dark-content" />
      <TitleOnlyHeader />
      <View style={containers.screenContainer}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', flexGrow: 1}}>
          <Text
            style={{
              fontFamily: fonts.muliBold,
              color: 'rgba(0,0,19,0.5)',
              fontSize: percentWidth(4.5),
              bottom: percentWidth(13),
              textAlign: 'center',
            }}>
            Enter Security PIN
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}>
            <Circle digit={0} animatedValue={firstDigitAnimatedValue} />
            <Circle digit={1} animatedValue={secondDigitAnimatedValue} />
            <Circle digit={2} animatedValue={thirdDigitAnimatedValue} />
            <Circle digit={3} animatedValue={fourthDigitAnimatedValue} />
            <Circle digit={4} animatedValue={fifthDigitAnimatedValue} />
            <Circle digit={5} animatedValue={sixthDigitAnimatedValue} />
          </View>
        </View>
        <View
          style={{
            height: percentHeight(34),
            width: percentWidth(100),
            flexDirection: 'row',
          }}>
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('1')}
              style={styles.numberContainer}>
              <Text style={styles.number}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('4')}
              style={styles.numberContainer}>
              <Text style={styles.number}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('7')}
              style={styles.numberContainer}>
              <Text style={styles.number}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress(null)}
              style={styles.numberContainer}>
              <Icon
                name="backspace"
                type="material-community"
                color={colors.text}
                size={screenHeight * 0.03}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.insideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('2')}
              style={styles.numberContainer}>
              <Text style={styles.number}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('5')}
              style={styles.numberContainer}>
              <Text style={styles.number}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('8')}
              style={styles.numberContainer}>
              <Text style={styles.number}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('0')}
              style={styles.numberContainer}>
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('3')}
              style={styles.numberContainer}>
              <Text style={styles.number}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('6')}
              style={styles.numberContainer}>
              <Text style={styles.number}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('9')}
              style={styles.numberContainer}>
              <Text style={styles.number}>9</Text>
            </TouchableOpacity>
            {touchIdSupported && (
              <TouchableOpacity
                onPress={() => authenticate()}
                style={styles.numberContainer}>
                <Icon
                  name="fingerprint"
                  type="material-community"
                  color={colors.text}
                  size={screenHeight * 0.04}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => signOut(timer, client, dispatch)}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            height: percentHeight(15),
          }}>
          <Text
            style={{
              fontFamily: fonts.muliBold,
              color: 'rgba(0,0,19,0.7)',
              fontSize: percentWidth(4.5),
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pin: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.09,
  },
  pinCircle: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.05,
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    top: -screenHeight * 0.01,
    fontSize: screenHeight * 0.05,
  },
  numberContainer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outsideColumn: {width: '33%'},
  insideColumn: {width: '34%'},
  number: {
    fontFamily: fonts.regular,
    fontSize: percentWidth(7),
    color: colors.text,
  },
});
