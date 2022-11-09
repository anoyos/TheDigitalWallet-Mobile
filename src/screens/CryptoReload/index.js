import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {SubHeader} from 'app/components/Headers';
import {XButton, PillButton} from 'app/components';
import {getState} from 'app/lib/react-simply';
import SafeAreaView from 'react-native-safe-area-view';
import {Icon} from 'react-native-elements';
import {useMutation} from '@apollo/react-hooks';
import {CREATE_COINBASE_CHARGE} from 'app/lib/api';
import Modal from 'react-native-modal';
import * as toast from 'app/lib/toast';
import {colors, containers, fonts, screenWidth, percentWidth} from 'app/styles';

export default function CryptoReload({navigation}) {
  const [{purchase, user}] = getState();
  const [showModal, setShowModal] = useState(false);
  const [charge, setCharge] = useState({});
  const [network, setNetwork] = useState('');
  const [createCoinbaseCharge] = useMutation(CREATE_COINBASE_CHARGE);

  const copyAddress = () => {
    toast.copyAddress();
    Clipboard.setString(charge.addresses[network]);
    setShowModal(false);
  };

  const displayExpiration = () => {
    if (charge.expires_at) {
      const expirationDate = new Date(charge.expires_at);
      return `${expirationDate.getHours()}:${expirationDate.getMinutes()}`;
    }
    return '';
  };

  const handleCryptoPress = async n => {
    setNetwork(n);
    try {
      const input = {
        name: `${user.firstName} ${user.lastName}`,
        description: 'Purchasing Digitall tokens.',
        amount: parseFloat(purchase.amount),
        currency: purchase.currency,
      };
      const {data} = await createCoinbaseCharge({variables: {input}});
      setCharge(data.createCoinbaseCharge);
      setShowModal(true);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="Reload with Crypto" navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        <TouchableOpacity
          onPress={() => handleCryptoPress('bitcoin')}
          style={styles.section}>
          <View style={styles.iconContainer}>
            <Icon
              name="bitcoin"
              type="material-community"
              color={colors.text}
              size={30}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Bitcoin</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{marginTop: -10}}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCryptoPress('ethereum')}
          style={styles.section}>
          <View style={styles.iconContainer}>
            <Icon
              name="ethereum"
              type="material-community"
              color={colors.text}
              size={30}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Ethereum</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{marginTop: -10}}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCryptoPress('litecoin')}
          style={styles.section}>
          <View style={styles.iconContainer}>
            <Icon
              name="litecoin"
              type="material-community"
              color={colors.text}
              size={30}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>LiteCoin</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{marginTop: -10}}
            />
          </View>
        </TouchableOpacity>
        <View style={{height: 30}} />
      </ScrollView>
      <Modal
        isVisible={showModal}
        swipeDirection={['down']}
        onSwipeComplete={() => setShowModal(false)}
        useNativeDriver>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentWidth(70),
            width: percentWidth(70),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 15,
          }}>
          <XButton
            top={screenWidth * 0.03}
            onPress={() => {
              setNetwork('');
              setShowModal(false);
            }}
          />
          <View
            style={{
              alignItems: 'center',
              position: 'absolute',
              bottom: percentWidth(5),
            }}>
            <Text style={{fontSize: percentWidth(7), fontFamily: fonts.bold}}>
              {network.toUpperCase()}
            </Text>
            <View
              style={{alignItems: 'center', marginVertical: percentWidth(2)}}>
              <Text
                style={{fontSize: percentWidth(4), fontFamily: fonts.regular}}>
                Expires at:
              </Text>
              <Text
                style={{fontSize: percentWidth(4), fontFamily: fonts.regular}}>
                {displayExpiration()}
              </Text>
            </View>
            <PillButton
              onPress={() => Linking.openURL(charge.hosted_url)}
              height={percentWidth(9)}
              width={percentWidth(40)}
              title="Go to Coinbase"
              titleSize={percentWidth(4)}
            />
            <PillButton
              onPress={copyAddress}
              height={percentWidth(9)}
              width={percentWidth(40)}
              title="Copy Address"
              titleSize={percentWidth(4)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  userInfoContainer: {
    left: 17,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  inputContainer: {paddingBottom: 10},
  securityTextContainer: {
    left: 17,
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: 'flex-end',
  },
  userInfoText: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  needHelpText: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: -0.27,
  },
  horoscopText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
    opacity: 0.8,
  },
  qrContainer: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: screenWidth * 0.45,
    width: screenWidth * 0.45,
  },
  section: {
    flexDirection: 'row',
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: screenWidth * 0.045,
  },
  sectionText: {
    color: colors.lightText,
    fontFamily: fonts.regular,
    fontSize: screenWidth * 0.038,
  },
  iconContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {width: '55%', justifyContent: 'center'},
});
