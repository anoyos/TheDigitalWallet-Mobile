import React from 'react';
import {View, ScrollView} from 'react-native';
import {getState} from 'app/lib/react-simply';
import {WalletCard} from 'app/components';
import {percentWidth, colors} from 'app/styles';
import * as WalletBackgrounds from 'app/assets/images/wallets';

export default function Scene1({style, width}) {
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
        image={WalletBackgrounds.USD}
        title="Digitall US Dollar"
        symbol="USD"
        balance={user.USDBalance > 0 ? user.USDBalance : 0}
      />
      <WalletCard
        image={WalletBackgrounds.GBP}
        title="Digitall British Pound"
        symbol="GBP"
        balance={user.GBP > 0 ? user.GBP / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.EUR}
        title="Digitall Euro"
        symbol="EUR"
        balance={user.EUR > 0 ? user.EUR / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.CHF}
        title="Digitall Swiss Franc"
        symbol="CHF"
        balance={user.CHF > 0 ? user.CHF / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.CAD}
        title="Digitall Canadian Dollar"
        symbol="CAD"
        balance={user.CAD > 0 ? user.CAD / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.AUD}
        title="Digitall Australian Dollar"
        symbol="AUD"
        balance={user.AUD > 0 ? user.AUD / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.NZD}
        title="Digitall New Zealand Dollar"
        symbol="NZD"
        balance={user.NZD > 0 ? user.NZD / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.JPY}
        title="Digitall Japanese Yen"
        symbol="JPY"
        balance={user.JPY > 0 ? user.JPY / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.NOK}
        title="Digitall Norwegian Krone"
        symbol="NOK"
        balance={user.NOK > 0 ? user.NOK / 1000000 : 0}
      />
      <WalletCard
        image={WalletBackgrounds.SEK}
        title="Digitall Swedish Krona"
        symbol="SEK"
        balance={user.SEK > 0 ? user.SEK / 1000000 : 0}
      />
      <View style={{height: percentWidth(50)}} />
    </ScrollView>
  );
}
