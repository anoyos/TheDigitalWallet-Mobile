import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {Button} from 'react-native-material-buttons';
import {Icon} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import {screenWidth, fonts, colors, percentWidth, headers} from 'app/styles';
import {getState} from 'app/lib/react-simply';
import Logo from 'app/assets/images/logo.png';

export default function MainHeader({navigation, admin, cashier}) {
  const [{notifications}] = getState();

  const adminOnPress = () => {
    if (cashier) return navigation.navigate('Wallets');
    return navigation.navigate('Cashier');
  };

  const adminIcon = () => {
    if (cashier) return 'wallet-outline';
    return 'cash-register';
  };

  return (
    <SafeAreaView
      style={{
        height: 60,

        alignContent: 'center',

        flexDirection: 'row',
      }}>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={navigation.openDrawer}>
          <Icon
            name="menu"
            type="material-community"
            color="#000000"
            size={percentWidth(5.2)}
          />
        </Button>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={Logo}
          style={{width: percentWidth(35), height: percentWidth(6.704545456)}}
        />
      </View>
      <View
        style={[
          styles.sideContainer,
          {alignItems: 'flex-end', left: percentWidth(2.5)},
        ]}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={
            admin ? adminOnPress : () => navigation.navigate('TransferScanner')
          }>
          <Icon
            name={admin ? adminIcon() : 'qrcode-scan'}
            type="material-community"
            color="#000000"
            size={percentWidth(5.2)}
          />
        </Button>
      </View>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={() => navigation.navigate('Notifications')}>
          {notifications.length > 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.bgColor,
                width: percentWidth(5.6),
                height: percentWidth(5.6),
                borderRadius: 100,
                position: 'absolute',
                top: -percentWidth(0.2),
                right: -percentWidth(0.2),
                zIndex: 4,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.secondaryColor,
                  width: percentWidth(5),
                  height: percentWidth(5),
                  borderRadius: 100,
                  zIndex: 5,
                }}>
                <Text
                  style={{
                    color: colors.buttonText,
                    fontFamily: fonts.semiBold,
                    fontSize: percentWidth(2.7),
                  }}>
                  {notifications.length}
                </Text>
              </View>
            </View>
          )}
          <Icon
            name="bell-outline"
            type="material-community"
            color="#000000"
            size={percentWidth(6)}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: screenWidth * 0.55,
    paddingLeft: screenWidth * 0.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: percentWidth(1.5),
  },
  sideContainer: {
    width: percentWidth(15),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: percentWidth(9.2),
    height: percentWidth(9.2),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
