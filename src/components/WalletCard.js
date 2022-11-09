import React from 'react';
import {Image, Text, View} from 'react-native';
import {Button} from 'react-native-material-buttons';
import {getState} from 'app/lib/react-simply';
import {percentWidth, fonts} from 'app/styles';
import NavigationService from 'app/lib/NavigationService';
import {localize} from 'app/lib/currency';
import {getSystemErrorName} from 'util';

export default function WalletCard({
  symbol,
  disabled,
  title,
  balance,
  image,
  small = false,
  titleOnly = false,
  displayConvertedAmount = false,
}) {
  const [{currencies, user}] = getState();
  const height = small
    ? percentWidth(16.2110520008)
    : percentWidth(24.3166023178);
  const width = small ? percentWidth(62.666604) : percentWidth(94);

  return (
    <Button
      disabled={disabled}
      disabledColor="transparent"
      onPress={() => {
        if (small)
          NavigationService.navigate('BankInfo', {
            symbol,
            disabled,
            title,
            balance,
            image,
          });
        else if (titleOnly) NavigationService.navigate('Wallets');
        else
          NavigationService.navigate('Wallet', {
            symbol,
            disabled,
            title,
            balance,
            image,
            displayConvertedAmount,
          });
      }}
      shadeBorderRadius={10}
      style={{
        marginBottom: percentWidth(2),
        overflow: 'hidden',

        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width,
        height,
        borderRadius: 10,
        zIndex: 5,
      }}>
      <Text
        style={{
          position: 'absolute',
          fontFamily: fonts.avenirBold,
          fontSize: small ? percentWidth(3.3) : percentWidth(4),
          top: titleOnly ? percentWidth(9) : percentWidth(5.5),
          color: '#FFFFFF',
          zIndex: 1,
        }}>
        {title.toUpperCase()}
      </Text>
      {!small && !titleOnly && (
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            bottom: percentWidth(6),
            zIndex: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: percentWidth(4.3),
              color: '#FFFFFF',
            }}>
            {balance} {symbol}
            {/* {`${localize(
              balance,
              user.locales,
              symbol == 'S&P'
                ? currencies['SP'].decimals
                : currencies[symbol].decimals,
            )} ${
              symbol === 'S&P'
                ? currencies['SP'].displaySymbol
                : currencies[symbol].displaySymbol
            } `} */}
          </Text>
          {balance > 0 &&
            displayConvertedAmount &&
            user.currency.symbol !== symbol && (
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: percentWidth(4.3),
                  color: '#FFFFFF',
                }}>
                {/* {`≈ ${localize(
                  user[`${symbol}ConvertedBalance`],
                  user.locales,
                  currencies[user.currency.symbol].decimals,
                )} ${currencies[user.currency.symbol].displaySymbol}`}  */}
              </Text>
            )}
        </View>
      )}
      <Image
        source={image}
        resizeMode="cover"
        style={{
          width: width + percentWidth(2),
          height: height + percentWidth(0.5173745174),
          zIndex: 0,
        }}
      />
    </Button>
  );
}
