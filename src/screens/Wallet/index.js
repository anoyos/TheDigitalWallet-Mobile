import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {WalletCard, PillButton} from 'app/components';
import {WalletHeader} from 'app/components/Headers';
import {useFocusState} from 'react-navigation-hooks';
import {getState} from 'app/lib/react-simply';
import {Button} from 'react-native-material-buttons';
import {Icon} from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import * as toast from 'app/lib/toast';
import Ethereum from 'app/lib/eth';
import RecentTransactions from 'app/screens/Wallet/RecentTransactions';
import {
  colors,
  fonts,
  screenWidth,
  containers,
  percentWidth,
  percentHeight,
} from 'app/styles';

export default function Wallet({navigation}) {
  const confirmedCCPurchase = navigation.getParam('confirmedCCPurchase', false);
  const symbol = navigation.getParam('symbol', false);
  const title = navigation.getParam('title', false);
  const image = navigation.getParam('image', false);
  const displayConvertedAmount = navigation.getParam(
    'displayConvertedAmount',
    false,
  );
  const [{user}, dispatch] = getState();
  const {isFocused} = useFocusState();

  useEffect(() => {
    if (!isFocused) return;
    dispatch({type: 'clearTransfer'});
    if (confirmedCCPurchase) {
      navigation.setParams({confirmedCCPurchase: false});
      toast.message('Debit Card transaction is processing.');
    }
    Ethereum.create(user).then(async eth => {
      let balance;
      if (user.superAdmin) balance = await eth.contractBalance(symbol);
      else balance = await eth.getBalance(symbol);
      const payload = {};
      payload[`${symbol}Balance`] = balance / 10 ** 6;
      dispatch({type: 'setUser', payload});
    });
  }, [isFocused]);

  const handleDepositPress = () => {
    dispatch({type: 'setPurchase', payload: {currency: symbol}});
    navigation.navigate('ReloadWallet');
  };

  if (user.superAdmin) {
    return (
      <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
        <WalletHeader
          title={title}
          navigation={navigation}
          address={user.walletAddress}
          symbol={symbol}
        />
        <View style={containers.screenContainer}>
          <View style={{flex: 1, marginTop: 10}}>
            <View style={styles.balanceContainer}>
              <WalletCard
                image={image}
                title={title}
                symbol={symbol}
                balance={user[`${symbol}Balance`]}
                disabled
                displayConvertedAmount={displayConvertedAmount}
              />
            </View>
            <View style={styles.buttonContainer}>
              <PillButton
                onPress={() => navigation.navigate('Deposit')}
                title="Deposit"
                width={screenWidth * 0.28}
                height={screenWidth * 0.1}
                borderRadius={5}
                titleSize={screenWidth * 0.038}
              />
            </View>
            <View
              style={[
                styles.userInfoContainer,
                {borderBottomColor: colors.primaryColor},
              ]}>
              <Text style={styles.userInfoText}>RECENT TRANSACTIONS</Text>
            </View>
            <RecentTransactions symbol={symbol} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <WalletHeader
        title={title}
        navigation={navigation}
        address={user.walletAddress}
        symbol={symbol}
      />
      <View style={containers.screenContainer}>
        <View style={{flex: 1, marginTop: 10}}>
          <View style={styles.balanceContainer}>
            <WalletCard
              image={image}
              title={title}
              symbol={symbol}
              balance={
                symbol === 'S&P' && user['SPBalance'] > 0
                  ? user['SPBalance']
                  : user[`${symbol}Balance`] > 0
                  ? user[`${symbol}Balance`]
                  : 0
              }
              disabled
              displayConvertedAmount={displayConvertedAmount}
            />
          </View>
          <View style={styles.buttonContainer}>
            <PillButton
              bgColor={colors.secondaryColor}
              onPress={handleDepositPress}
              title="Deposit"
              condition={true}
              // condition={[
              //   'Gold',
              //   'Silver',
              //   'Platinum',
              //   'Oil',
              //   'FTSE',
              //   'S&P',
              //   'EURSTOXX',
              //   'BTC',
              //   'ETH',
              //   'XRP',
              //   'LTC',
              //   'GoldSovereign',
              //   'GoldBritannia',
              //   'SilverBritannia',
              // ].includes(symbol)}
              width={screenWidth * 0.48}
              height={screenWidth * 0.1}
              borderRadius={5}
              titleSize={screenWidth * 0.038}
              marginVertical={percentHeight(0.6)}
            />
            <PillButton
              bgColor={colors.secondaryColor}
              onPress={() => navigation.navigate('Exchange', {symbol})}
              condition={user[`${symbol}Balance`] <= 0}
              title="Exchange"
              width={screenWidth * 0.48}
              height={screenWidth * 0.1}
              borderRadius={5}
              titleSize={screenWidth * 0.038}
              marginVertical={percentHeight(0.6)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <PillButton
              bgColor={colors.secondaryColor}
              onPress={() => navigation.navigate('TransferScanner', {symbol})}
              title="Pay"
              width={screenWidth * 0.48}
              condition={user[`${symbol}Balance`] <= 0}
              height={screenWidth * 0.1}
              borderRadius={5}
              titleSize={screenWidth * 0.038}
              marginVertical={percentHeight(0.6)}
            />
            <PillButton
              bgColor={colors.secondaryColor}
              onPress={() => navigation.navigate('TransferOrRequest', {symbol})}
              title="Transfer"
              width={screenWidth * 0.48}
              condition={user[`${symbol}Balance`] <= 0}
              height={screenWidth * 0.1}
              borderRadius={5}
              titleSize={screenWidth * 0.038}
              marginVertical={percentHeight(0.6)}
            />
          </View>
          <View
            style={[
              styles.userInfoContainer,
              {borderBottomColor: colors.primaryColor},
            ]}>
            <Text style={styles.userInfoText}>RECENT TRANSACTIONS</Text>
          </View>
          <RecentTransactions symbol={symbol} />
        </View>
      </View>
      {user[`${symbol}Balance`] > 0 && (
        <Button
          color={colors.secondaryColor}
          shadeBorderRadius={50}
          onPress={() => navigation.navigate('WithdrawalAmount', {symbol})}
          style={{
            width: percentWidth(37),
            height: percentWidth(10),
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: percentHeight(5),
            right: percentWidth(5),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            flexDirection: 'row',
          }}>
          <Icon
            name="send"
            type="font-awesome"
            color="white"
            size={percentWidth(4.4)}
          />
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: percentWidth(4.4),
              color: 'white',
              marginLeft: percentWidth(3),
            }}>
            Withdraw
          </Text>
        </Button>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: percentHeight(7),
    right: percentWidth(7),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  buttonContainer: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  userInfoContainer: {
    paddingVertical: 10,
    justifyContent: 'flex-end',
    borderBottomWidth: 0.5,
  },
  userInfoText: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  balanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
    fontSize: 17,
    paddingTop: 20,
    textAlign: 'center',
  },
  emptyListText2: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
    fontSize: 17,
    textAlign: 'center',
  },
});
