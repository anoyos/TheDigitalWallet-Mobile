import React from 'react';
import {View, ScrollView} from 'react-native';
import {getState} from 'app/lib/react-simply';
import {percentWidth, colors} from 'app/styles';
import {WalletCard} from 'app/components';
import * as WalletBackgrounds from 'app/assets/images/wallets';

export default function Scene2({style, width}) {
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
        image={WalletBackgrounds.Platinum}
        title="Digitall Platinum"
        symbol="Platinum"
        balance={user.PlatinumBalance > 0 ? user.PlatinumBalance / 1000000 : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.Gold}
        title="Digitall Gold"
        symbol="Gold"
        balance={user.GoldBalance > 0 ? user.GoldBalance : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.Silver}
        title="Digitall Silver"
        symbol="Silver"
        balance={user.Silver > 0 ? user.Silver / 1000000 : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.GoldSovereign}
        title="Gold Sovereign"
        symbol="GoldSovereign"
        balance={user.GoldSovereignBalance}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.GoldBritannia}
        title="Gold Britannia"
        symbol="GoldBritannia"
        balance={user.GoldBritanniaBalance}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.SilverBritannia}
        title="Silver Britannia"
        symbol="SilverBritannia"
        balance={user.SilverBritanniaBalance}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.Oil}
        title="Digitall Oil"
        symbol="Oil"
        balance={user.Oil > 0 ? user.Oil / 1000000 : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.FTSE}
        title="Digitall FTSE"
        symbol="FTSE"
        balance={user.FTSE > 0 ? user.FTSE / 1000000 : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.SandP}
        title="Digitall S&P"
        symbol="S&P"
        balance={user.SP > 0 ? user.SP / 1000000 : 0}
        displayConvertedAmount
      />
      <WalletCard
        image={WalletBackgrounds.EURSTOXX}
        title="Digitall Euro Stoxx"
        symbol="EURSTOXX"
        balance={user.EURSTOXX > 0 ? user.EURSTOXX / 1000000 : 0}
        displayConvertedAmount
      />
      <View style={{height: percentWidth(50)}} />
    </ScrollView>
  );
}
