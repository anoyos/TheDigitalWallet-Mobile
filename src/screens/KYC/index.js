import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {PillButton} from 'app/components';
import {getState} from 'app/lib/react-simply';
import {useApolloClient} from '@apollo/react-hooks';
import {GET_SUM_SUB_ACCESS_CODE} from 'app/lib/api';
import SafeAreaView from 'react-native-safe-area-view';
import {percentWidth, fonts, percentHeight} from 'app/styles';
import * as toast from 'app/lib/toast';
import SNSMobileSDK from '@sumsub/react-native-mobilesdk-module';
import Image1 from 'app/assets/images/kyc1.png';
import Image2 from 'app/assets/images/kyc2.png';

export default function KYC({navigation}) {
  const client = useApolloClient();
  const [{user}, dispatch] = getState();

  const getAccessToken = async () => {
    let accessToken = '';
    try {
      const {
        data: {requestAccessToken},
      } = await client.query({query: GET_SUM_SUB_ACCESS_CODE});
      accessToken = requestAccessToken.token;
    } catch (error) {
      toast.error(error);
    }

    return accessToken;
  };

  const handleLaunchSumSub = async () => {
    const apiUrl = 'https://api.sumsub.com'; // or https://api.sumsub.com
    const flowName = 'msdk-basic-kyc'; // or set up your own with the dashboard
    const accessToken = await getAccessToken();

    const snsMobileSDK = SNSMobileSDK.Builder(apiUrl, flowName)
      .withAccessToken(accessToken, async () => {
        const newToken = await getAccessToken();
        return newToken;
      })
      // .withHandlers({
      //   onActionResult: (result) => {
      //     console.log(`onActionResult: ${JSON.stringify(result)}`)
      //     // you must return a `Promise` that in turn should be resolved with
      //     // either `cancel` to force the user interface to close, or `continue` to proceed as usual
      //     return new Promise((resolve) => {
      //       resolve('continue')
      //     })
      //   },
      // })
      .withDebug(true)
      .withSupportEmail('info@digitall.life')
      .build();

    snsMobileSDK
      .launch()
      .then(result => {
        console.log('result', result);
        if (result.status)
          dispatch({type: 'setUserKYC', payload: {status: 'started'}});
        navigation.navigate('Wallets');
      })
      .catch(err => {
        console.log(err);
        navigation.navigate('Wallets');
      });
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="Know your Client" navigation={navigation} />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingLeft: percentWidth(5),
          paddingRight: percentWidth(5),
          marginTop: percentWidth(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
          <Image
            source={Image2}
            style={{width: percentWidth(13), height: percentWidth(13)}}
            resizeMode="contain"
          />
          <Text
            style={{fontFamily: fonts.avenirBold, fontSize: percentWidth(5.5)}}>
            IMPORTANT NOTICE
          </Text>
          <Image
            source={Image2}
            style={{width: percentWidth(13), height: percentWidth(13)}}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text
            style={{
              color: 'darkred',
              fontSize: percentWidth(4.5),
              textAlign: 'center',
              fontFamily: fonts.avenirBold,
            }}>
            Before you will be able to load your wallet please read the below
            information
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.text}>To comply with the Bank Secrecy Act,</Text>
          <Text style={styles.text}>
            international anti-money laundering rules
          </Text>
          <Text style={styles.text}>and our know your client obligations,</Text>
          <Text style={styles.text}>ALL DIGITAL WALLET USERS</Text>
          <Text style={styles.text}>
            will initially need to provide personal
          </Text>
          <Text style={styles.text}>or business identity information</Text>
          <Text style={[styles.text, {marginBottom: percentHeight(1)}]}>
            before being able to load your wallet with funds.
          </Text>
        </View>
        <View>
          <Image
            source={Image1}
            style={{width: percentHeight(23), height: percentHeight(23)}}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.text}>The purpose of the AML rules</Text>
          <Text style={styles.text}>
            is to help detect and report suspicious activity
          </Text>
          <Text style={styles.text}>included the predicate offenses to</Text>
          <Text style={styles.text}>
            money laundering and terrorist financing, such as
          </Text>
          <Text style={styles.text}>
            securities fraud and market manipulation.
          </Text>
        </View>
        <Text>{JSON.stringify(user.kyc)}</Text>
        <PillButton
          title={user.kyc.status ? 'Check KYC' : 'Begin KYC'}
          onPress={handleLaunchSumSub}
          width={percentWidth(60)}
          bgColor="darkred"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.avenir,
    fontSize: percentWidth(3.5),
  },
});
