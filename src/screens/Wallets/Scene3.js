import React from 'react';
import {View, ScrollView} from 'react-native';
import {getState} from 'app/lib/react-simply';
import {percentWidth, colors} from 'app/styles';
import {WalletCard} from 'app/components';
import * as WalletBackgrounds from 'app/assets/images/wallets';

export default function Scene5({style, width}) {
  const [{user}] = getState();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        style,
        {
          width,
          backgroundColor: colors.bgColor,
          paddingTop: percentWidth(42),
        },
      ]}>
      <WalletCard
        image={WalletBackgrounds.BTC}
        title="Digitall Bitcoin"
        symbol="BTC"
        balance={user.BTCBalance > 0 ? user.BTCBalance : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.ETH}
        title="Digitall Ether"
        symbol="ETH"
        balance={user.ETH > 0 ? user.ETH / 1000000 : 0}
        displayConvertedAmount
      />
      {/* <WalletCard
        image={WalletBackgrounds.Litecoin}
        title="Digitall Litecoin"
        symbol="LTC"
        balance={user.LTCBalance}
        displayConvertedAmount
      /> */}
      <View style={{height: percentWidth(50)}} />
    </ScrollView>
  );
}
