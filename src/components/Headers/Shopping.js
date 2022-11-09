import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import {Button} from 'react-native-material-buttons';
import {getState} from 'app/lib/react-simply';
import {
  screenWidth,
  fonts,
  colors,
  shadow,
  headers,
  percentWidth,
} from 'app/styles';

export default function MainHeader({navigation, title}) {
  const [{cart}] = getState();
  return (
    <SafeAreaView
      forceInset={{top: 'always'}}
      style={{
        height: 50,

        alignContent: 'center',

        flexDirection: 'row',
      }}>
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => navigation.goBack(null)}>
        <Icon
          name="arrow-left"
          type="material-community"
          color="#000000"
          size={percentWidth(6)}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={headers.title}>{title}</Text>
      </View>
      <View style={styles.sideContainer}>
        <Button
          shadeBorderRadius={1000}
          color="transparent"
          style={styles.button}
          onPress={() => navigation.navigate('ShoppingCart')}>
          {cart.length > 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.secondaryColor,
                width: percentWidth(4),
                height: percentWidth(4),
                borderRadius: 100,
                position: 'absolute',
                top: percentWidth(0),
                right: percentWidth(0),
                zIndex: 5,
                ...shadow,
              }}>
              <Text
                style={{
                  color: colors.buttonText,
                  fontFamily: fonts.semiBold,
                  fontSize: percentWidth(2.7),
                }}>
                {cart.length}
              </Text>
            </View>
          )}
          <Icon
            name="cart-outline"
            type="material-community"
            color="#000000"
            size={23}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: percentWidth(60),
    marginRight: percentWidth(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: percentWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: percentWidth(8),
    height: percentWidth(8),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideContainer: {
    width: percentWidth(15),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: percentWidth(1.1),
  },
});
