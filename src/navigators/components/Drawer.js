import React from 'react'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import { Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { getState } from 'app/lib/react-simply'
import { useApolloClient } from '@apollo/react-hooks'
import { Button } from 'react-native-material-buttons'
import LinearGradient from 'react-native-linear-gradient'
import { signOut } from 'app/lib/auth'
import { navigateToScreen } from 'app/lib/auth/utils'
import QRCode from 'react-native-qrcode-svg'
import { colors, fonts, shadow, screenWidth, percentHeight, percentWidth } from 'app/styles'

export default function Drawer({ navigation }) {
  const client = useApolloClient()
  const [{ user: { isSuperUser, firstName, lastName, walletAddress, admin, business, currency, email, kyc, remainingFreeTransactions }, timer }, dispatch] = getState()
  const name = `${firstName} ${lastName}`
  const qrText = JSON.stringify({ toAddress: walletAddress, name, toSymbol: currency.symbol, toEmail: email })

  const handleItemPress = (screen) => {
    navigation.closeDrawer()
    navigation.navigate(screen)
  }

  const kycRequiredPress = (screen) => {
    navigation.closeDrawer()
    navigateToScreen(screen, kyc, navigation.navigate)
  }

  const handleSignOut = () => {
    signOut(timer, client, dispatch)
  }

  if (admin) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={{ height: percentHeight(5) }} />
            <View style={styles.topContainer}>
              <View style={{ width: '45%', justifyContent: 'center', paddingLeft: '6%' }}>
                <Text style={styles.name}>{`${business && business.name}`}</Text>
              </View>
              <View style={{ width: '45%', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
                  <View style={styles.button}>
                    <LinearGradient
                      style={styles.button}
                      colors={colors.walletGradient}
                      start={{ x: -0.35, y: 0 }}
                      end={{ x: 1.08, y: -0.09 }}
                      locations={[0, 1]}
                    >
                      <Text style={styles.buttonText}>Settings</Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginVertical: 20 }}>
              <TouchableOpacity
                onPress={() => handleItemPress('Transactions')}
                style={styles.listItem}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="format-list-numbered"
                    type="material-community"
                    color={colors.text}
                    size={23}
                  />
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>Community Ledger</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleItemPress('Notifications')}
                style={styles.listItem}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="bell-outline"
                    type="material-community"
                    color={colors.text}
                    size={23}
                  />
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>Notifications</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleItemPress('Referrals')}
                style={styles.listItem}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="account-multiple"
                    type="material-community"
                    color={colors.text}
                    size={23}
                  />
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>Referral Log</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleItemPress('InviteFriends')}
                style={styles.listItem}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="account-multiple-plus"
                    type="material-community"
                    color={colors.text}
                    size={23}
                  />
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>Invite a Friend</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => kycRequiredPress('KYCSuccess')}
                style={styles.listItem}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="user-secret"
                    type="font-awesome"
                    color={colors.text}
                    size={23}
                  />
                </View>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>Complete Your KYC</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
              <Button
                onPress={handleSignOut}
                color="transparent"
                shadeBorderRadius={percentWidth(5)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: percentWidth(30),
                  height: percentWidth(10),
                  borderRadius: percentWidth(5),
                }}
              >
                <Text style={[styles.signOut, { color: colors.primaryColor }]}>
                  Sign Out
                </Text>
              </Button>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={{ height: 195, justifyContent: 'flex-end' }}>
            { !!qrText && (
              <TouchableOpacity
                onPress={() => navigation.navigate('QRCodeScreen', { address: walletAddress, title: 'QR Code' })}
                style={styles.qrContainer}
              >
                <QRCode
                  value={qrText}
                  size={150}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.topContainer}>
            <View style={{ width: '53%', justifyContent: 'center', paddingLeft: '6%' }}>
              <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
              {isSuperUser
                ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: percentWidth(3.7), fontFamily: fonts.regular }}>
                      Super User
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: percentWidth(3.7), fontFamily: fonts.regular }}>
                      Free Transfers:
                    </Text>
                    <Text style={{ marginLeft: percentWidth(1), fontSize: percentWidth(3.7), fontFamily: fonts.regular, color: colors.primaryColor }}>
                      {remainingFreeTransactions}
                    </Text>
                  </View>
                )}
            </View>
            <View style={{ width: '45%', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
                <View style={styles.button}>
                  <LinearGradient
                    style={styles.button}
                    colors={colors.walletGradient}
                    start={{ x: -0.35, y: 0 }}
                    end={{ x: 1.08, y: -0.09 }}
                    locations={[0, 1]}
                  >
                    <Text style={styles.buttonText}>Settings</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <TouchableOpacity
              onPress={() => handleItemPress('GiftCardScreen')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="wallet-giftcard"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Gift Cards</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleItemPress('Discover')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="location"
                  type="entypo"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Discover</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleItemPress('Transactions')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="format-list-numbered"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Community Ledger</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleItemPress('Notifications')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="bell-outline"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Notifications</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleItemPress('Referrals')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="account-multiple"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Referral Log</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleItemPress('InviteFriends')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="account-multiple-plus"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Invite a Friend</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('http://www.digitall.life/walkthrough-video')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="link"
                  type="material-community"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Link</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => kycRequiredPress('KYCSuccess')}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="user-secret"
                  type="font-awesome"
                  color={colors.text}
                  size={23}
                />
              </View>
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>Complete Your KYC</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <Button
              onPress={handleSignOut}
              color="transparent"
              shadeBorderRadius={percentWidth(5)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                width: percentWidth(30),
                height: percentWidth(10),
                borderRadius: percentWidth(5),
              }}
            >
              <Text style={[styles.signOut, { color: colors.primaryColor }]}>
                Sign Out
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomTabIconSmall: {
    marginTop: 10,
    marginLeft: 10,
  },
  imageContainer: {
    borderRadius: 10,
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    backgroundColor: colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    ...shadow,
  },
  topContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightText,
  },
  secondContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightText,
  },
  coinBalance: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    paddingTop: 3,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.35,
  },
  title: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.75,
    fontSize: 20,
    width: '80%',
    paddingVertical: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    color: colors.buttonText,
    fontSize: 12,
    letterSpacing: -0.1,
  },
  button: {
    height: 25,
    width: 70,
    borderRadius: 25,
    justifyContent: 'center',
    marginVertical: 10,
    ...shadow,
  },
  copyButton: {
    backgroundColor: colors.primaryColor,
    height: 25,
    width: 105,
    borderRadius: 25,
    justifyContent: 'center',
    marginVertical: 10,
    ...shadow,
  },
  listItem: {
    flexDirection: 'row',
    height: 40,
  },
  iconContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitleContainer: {
    width: '75%',
    justifyContent: 'center',
  },
  itemTitle: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  qrContainer: {
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: colors.secondaryColor,
    borderRadius: 7,
    borderWidth: 1,
    height: 162,
    width: 162,
  },
  bottomContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightText,
  },
  signOut: {
    fontFamily: fonts.regular,
    fontSize: 17,
  },
})
