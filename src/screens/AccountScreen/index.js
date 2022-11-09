import React, {useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {signOut} from 'app/lib/auth';
import {getState} from 'app/lib/react-simply';
import {Button} from 'react-native-material-buttons';
import {SubHeader} from 'app/components/Headers';
import * as api from 'app/lib/api';
import SafeAreaView from 'react-native-safe-area-view';
import {useApolloClient} from '@apollo/react-hooks';
import NavigationService from 'app/lib/NavigationService';
import {Icon} from 'react-native-elements';
import {PillButton} from 'app/components';
import {
  colors,
  percentHeight,
  percentWidth,
  fonts,
  containers,
} from 'app/styles';

const InfoItem = ({field, value, screen, disabled = false}) => (
  <Button
    onPress={() => NavigationService.navigate(screen)}
    disabledColor="transparent"
    disabled={disabled}
    color="transparent"
    shadeBorderRadius={50}
    style={{
      flexDirection: 'row',
      width: percentWidth(92),
      paddingLeft: percentWidth(2),
      paddingVertical: percentWidth(2),
      marginVertical: percentWidth(1),
      alignSelf: 'center',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0,0,0,0.3)',
    }}>
    <View style={{justifyContent: 'center'}}>
      <Text style={{fontSize: percentWidth(4), fontFamily: fonts.bold}}>
        {field}
      </Text>
    </View>
    <View
      style={{flexGrow: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: percentWidth(4),
          fontFamily: fonts.regular,
          color: '#939CBC',
        }}>
        {value}
      </Text>
    </View>
    <View
      style={{
        alignItems: 'center',
        paddingHorizontal: percentWidth(2),
        marginRight: percentWidth(2),
      }}>
      {!disabled && (
        <Icon
          name="right"
          type="antdesign"
          color={colors.secondaryColor}
          size={percentWidth(4)}
        />
      )}
    </View>
  </Button>
);

export default function AccountScreen({navigation}) {
  const client = useApolloClient();
  const [{user, timer}, dispatch] = getState();
  const phone = user.kyc && user.kyc.phone ? user.kyc.phone : 'none';

  const getBankAccountsHandler = async () => {
    const bankAccounts = await api.getBankAccounts();
    dispatch({type: 'setBankAccounts', payload: bankAccounts});
  };

  useEffect(() => {
    getBankAccountsHandler();
  }, []);

  const handleSignOut = () => {
    signOut(timer, client, dispatch);
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="Account Settings" navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={containers.screenContainer}>
        <View
          style={{
            height: percentHeight(7),
            paddingLeft: percentWidth(5),
            justifyContent: 'center',
            marginTop: percentHeight(2),
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: percentWidth(5),
              color: 'rgba(0,0,0,0.5)',
            }}>
            YOUR INFORMATION
          </Text>
        </View>
        <InfoItem
          field="Name"
          value={`${user.firstName} ${user.lastName}`}
          disabled
        />
        <InfoItem field="Email" value={user.email} disabled />
        <InfoItem field="Mobile Number" value={phone} disabled />
        <InfoItem
          field="Remaining Free Transactions"
          value={user.remainingFreeTransactions}
          disabled
        />
        <InfoItem field="Referral Code" value={user.referralCode} />
        <InfoItem
          field="Default Currency"
          value={user.currency.symbol}
          screen="DefaultCurrency"
        />
        <InfoItem field="Bank Details" screen="BankAccounts" />
        <View
          style={{
            height: percentHeight(7),
            paddingLeft: percentWidth(5),
            justifyContent: 'center',
            marginTop: percentWidth(5),
          }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: percentWidth(5),
              color: 'rgba(0,0,0,0.5)',
            }}>
            SECURITY
          </Text>
        </View>
        <InfoItem field="Change Password" screen="ChangePassword" />
        <InfoItem field="Change Pin" screen="ChangePin" />
        <View
          style={{
            height: percentHeight(20),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <PillButton
            gradient
            onPress={handleSignOut}
            height={percentWidth(10)}
            width={percentWidth(50)}
            title="Sign out"
            bgColor={colors.secondaryColor}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
