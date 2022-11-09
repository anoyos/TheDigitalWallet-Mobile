/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import Modal from 'react-native-modal'
import { UserListItem, PillButton } from 'app/components'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { colors, fonts, screenWidth, containers, percentWidth, percentHeight } from 'app/styles'

export default function TransferOrRequest({ navigation }) {
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  const symbol = navigation.getParam('symbol', false)
  const [loading, setLoading] = useState(false)
  const [showAddFriendModal, setShowAddFriendModal] = useState(false)
  const [{ friends, user }, dispatch] = getState()

  const getFriends = async () => {
    const payload = []
    try {
      const friendsResponse = await api.getFriends()
      // eslint-disable-next-line no-unused-vars
      for (const item of friendsResponse) {
        // eslint-disable-next-line no-await-in-loop
        const { user: cognitoUser } = await api.getUserInfo(item.friend)
        const obj = {}
        if (!cognitoUser) {
          obj.name = 'Pending Invite'
          obj.walletAddress = ''
          obj.email = item.friend
        } else {
          obj.name = cognitoUser.Attributes[0].Value
          obj.walletAddress = cognitoUser.Attributes[1].Value
          obj.email = cognitoUser.Attributes[2].Value
        }
        payload.push(obj)
      }
      dispatch({ type: 'setFriends', payload })
    } catch (err) {
      toast.error(err)
    }
  }

  useEffect(() => {
    getFriends()
  }, [])

  const search = () => friends.filter((x) => x.email.toLowerCase().includes(query.toLowerCase()) || x.name.toLowerCase().includes(query.toLowerCase()))

  const handleAddFriend = async () => {
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!regexEmail.test(email)) {
      setLoading(false)
      return toast.message('Please enter valid email')
    }
    setLoading(true)
    const newFriend = await api.getUserInfo(email)
    if (!newFriend.user) {
      await api.createReferral({ referred_email: email })
      toast.message(`You have successfully sent an invite to ${email}`)
    }
    try {
      await api.addFriend({ friend: email })
      getFriends()
      setLoading(false)
      setShowAddFriendModal(false)
    } catch (err) {
      setLoading(false)
      setShowAddFriendModal(false)
      toast.error(err)
    }
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Transfer" navigation={navigation} />
      <View style={containers.screenContainer}>
        <TextInput
          onChangeText={(text) => setQuery(text)}
          placeholder="Look up users by email."
          placeholderTextColor="#808080"
          style={{
            height: screenWidth * 0.12,
            width: screenWidth,
            justifyContent: 'center',
            paddingLeft: screenWidth * 0.05,
            borderBottomColor: colors.lightText,
            borderBottomWidth: 0.5,
            fontFamily: fonts.regular,
            fontSize: screenWidth * 0.042,
          }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('TransferScanner')}
            style={{
              height: screenWidth * 0.17,
              width: screenWidth,
              borderBottomColor: colors.lightText,
              borderBottomWidth: 0.5,
              flexDirection: 'row',
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '18%' }}>
              <Icon
                name="qrcode-scan"
                type="material-community"
                color={colors.primaryColor}
                size={screenWidth * 0.07}
              />
            </View>
            <View style={{ justifyContent: 'center', width: '75%' }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fonts.regular,
                  fontSize: screenWidth * 0.04,
                  marginBottom: screenWidth * 0.004,
                }}
              >
                Scan QR Code
              </Text>
              <Text
                style={{
                  color: '#808080',
                  fontFamily: fonts.regular,
                  fontSize: screenWidth * 0.035,
                  marginTop: screenWidth * 0.004,
                }}
              >
                Instantly transfer or request money.
              </Text>
            </View>
          </TouchableOpacity>
          {/* <View style={{ paddingVertical: percentHeight(2) }}>
            <InfoItem field="Send to Debit Card" value="DEBIT_CARD" screen="TransferAmount" />
            <InfoItem field="Send to Bank" value="BANK_ACCOUNT" screen="TransferAmount" />
          </View> */}
          <View style={{ marginLeft: percentWidth(6), marginTop: percentWidth(5) }}>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>Send to a Friend</Text>
              <Text style={styles.userInfoSubText}>Select which friend you would like to send money to.</Text>
            </View>
            <PillButton
              title="Add Friend"
              onPress={() => setShowAddFriendModal(true)}
              gradient
              width={percentWidth(30)}
              height={percentWidth(8)}
            />
          </View>
          <View style={{ marginTop: screenWidth * 0.04 }}>
            {
              search().map((f) => <UserListItem key={f.walletAddress} user={f} symbol={symbol} />)
            }
          </View>
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
      <Modal
        isVisible={showAddFriendModal}
        useNativeDriver
        onSwipeComplete={() => setShowAddFriendModal(false)}
        swipeThreshold={50}
        style={{ bottom: percentHeight(11) }}
        swipeDirection={['up', 'down', 'right', 'left']}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddFriendModal(false)}>
          <Text
            style={{
              textAlign: 'right',
              color: 'white',
              fontFamily: fonts.bold,
              fontSize: percentWidth(5),
              paddingRight: percentWidth(9),
            }}
          >
            Close
          </Text>
        </TouchableWithoutFeedback>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentWidth(50),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: percentWidth(2),
          }}
        >
          <View style={{ width: '80%', height: '65%', justifyContent: 'center', alignItems: 'center', marginTop: -percentWidth(2) }}>
            <View style={{ height: '33.33%', alignItems: 'center', width: '100%' }}>
              <View style={{ }}>
                <Text style={{
                  fontSize: percentWidth(5),
                  fontFamily: fonts.bold,
                  color: colors.text,
                  paddingBottom: percentWidth(3),
                }}
                >
                  Enter email:
                </Text>
              </View>
              <View style={{ width: '100%' }}>
                <TextInput
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="joesmith@email.com"
                  returnKeyType="done"
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  value={email}
                  style={{
                    paddingVertical: percentWidth(1.2),
                    paddingLeft: percentWidth(2),
                    fontSize: percentWidth(4),
                    color: colors.text,
                    borderWidth: 0.5,
                    borderRadius: percentWidth(2),
                  }}
                  onChangeText={(value) => setEmail(value)}
                />
              </View>
            </View>
          </View>
          <View style={{ height: '35%', justifyContent: 'center', alignItems: 'center' }}>
            {
              loading
                ? <ActivityIndicator color={colors.primaryColor} size="large" />
                : (
                  <PillButton
                    onPress={handleAddFriend}
                    titleSize={percentWidth(3.8)}
                    title="Add Friend"
                    width={percentWidth(40)}
                    height={percentWidth(10)}
                    gradient
                  />
                )
            }
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  userInfoContainer: {
    marginTop: screenWidth * 0.03,
    marginBottom: screenWidth * 0.02,
  },
  userInfoText: { fontSize: percentWidth(5), fontFamily: fonts.bold },
  userInfoSubText: {
    color: '#808080',
    fontFamily: fonts.regular,
    fontSize: screenWidth * 0.035,
    marginTop: screenWidth * 0.004,
  },
})
