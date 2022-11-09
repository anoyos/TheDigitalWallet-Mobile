/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { Button } from 'react-native-material-buttons'
import { useFocusState } from 'react-navigation-hooks'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { getState } from 'app/lib/react-simply'
import { containers, colors, fonts, percentWidth, percentHeight } from 'app/styles'
import LinearGradient from 'react-native-linear-gradient'

const ReferralItem = ({
  disabled,
  onPress,
  referral: {
    pending,
    createdAt,
    referredEmail,
    referrerName,
  },
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date(createdAt)
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const formattedDate = `${day} ${month} ${year}`

  return (
    <Button
      disabled={disabled}
      disabledColor="transparent"
      onPress={onPress}
      color="transparent"
      style={styles.giftItemContainer}
    >
      <View style={{ height: '100%', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={colors.giftGradient}
          useAngle
          angle={40}
          style={styles.giftIcon}
        >
          <Text style={styles.giftIconText}>{pending ? 'PENDING' : 'REDEEMED'}</Text>
        </LinearGradient>
      </View>
      <View style={{ width: '50%', justifyContent: 'center' }}>
        <Text style={{ color: colors.secondaryColor, fontSize: percentWidth(3), fontFamily: fonts.regular }}>{formattedDate}</Text>
        <Text style={{ paddingVertical: percentWidth(1), color: colors.text, fontSize: percentWidth(3.5), fontFamily: fonts.regular }}>{referrerName}</Text>
        <Text style={{ color: 'gray', fontSize: percentWidth(3.5), fontFamily: fonts.regular }}>{referredEmail}</Text>
      </View>
      <View style={{ height: '100%', width: '20%', justifyContent: 'center', alignItems: 'center' }}>
        {!disabled && (
          <Icon
            name="right"
            type="antdesign"
            color={colors.primaryColor}
            size={percentWidth(4)}
          />
        )}
      </View>
    </Button>
  )
}

export default function InviteFriends({ navigation }) {
  const [{ referrals, user }, dispatch] = getState()
  const { isFocused } = useFocusState()
  const [showAcceptReferral, setShowAcceptReferral] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [declineLoading, setDeclineLoading] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState({})
  const [selectedUser, setSelectedUser] = useState({})

  const getReferrals = async () => {
    const sentReferrals = await api.getReferrals()
    const pendingReferrals = await api.getPendingReferrals()
    dispatch({ type: 'setReferrals', payload: { pendingReferrals, sentReferrals } })
  }

  useEffect(() => {
    if (!isFocused) return
    getReferrals()
    setTimeout(() => setLoaded(true), 10)
  }, [isFocused])

  useEffect(() => {
    if (!loaded) return
    api.getUserInfo(selectedReferral.referrerEmail)
      .then(({ user: cognitoUser }) => setSelectedUser(cognitoUser))
      .catch((err) => toast.error(err))
  }, [selectedReferral])

  const acceptReferral = async (id) => {
    setLoading(true)
    await api.acceptReferral({
      id,
      referrer_aws_user_id: selectedUser.Username,
      referrer_address: selectedUser.Attributes[1].Value,
      referred_address: user.walletAddress,
      referrer_email: selectedReferral.referrerEmail,
      referred_email: user.email,
    })
    setLoading(false)
    setShowAcceptReferral(false)
    navigation.popToTop()
  }

  const declineReferral = async (id) => {
    setDeclineLoading(true)
    await api.declineReferral({ id })
    setDeclineLoading(false)
    setShowAcceptReferral(false)
  }

  const handleReferralPress = (referral) => {
    setShowAcceptReferral(true)
    setSelectedReferral(referral)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title="Referrals" />
      <ScrollView style={containers.screenContainer} showsVerticalScrollIndicator={false}>
        {
          referrals.pendingReferrals.length > 0 && referrals.sentReferrals.length > 0
            && (
              <View style={styles.noReferralsContainer}>
                <Text style={styles.userInfoText}>You have no referrals pending or accepted.</Text>
              </View>
            )
        }
        {
          referrals.pendingReferrals.length > 0
            && (
              <>
                <View style={[styles.userInfoContainer, { borderBottomColor: colors.primaryColor, borderBottomWidth: 0.5 }]}>
                  <Text style={[styles.userInfoText, { left: 17 }]}>Accept to give referrer credit (only one)</Text>
                </View>
                <View>
                  { referrals.pendingReferrals.map((referral) => (
                    <ReferralItem key={`referral-${referral.id}`} referral={referral} onPress={() => handleReferralPress(referral)} />
                  ))}
                </View>
              </>
            )
        }
        {
          referrals.sentReferrals.length > 0
            && (
              <>
                <View style={[styles.userInfoContainer, { borderBottomColor: colors.primaryColor, borderBottomWidth: 0.5 }]}>
                  <Text style={[styles.userInfoText, { left: 17 }]}>Referrals you've sent.</Text>
                </View>
                <View>
                  {referrals.sentReferrals.map((referral) => <ReferralItem key={`referral-${referral.id}`} referral={referral} disabled />)}
                </View>
              </>
            )
        }
      </ScrollView>
      <Modal
        isVisible={showAcceptReferral}
        useNativeDriver
        onBackdropPress={() => { setShowAcceptReferral(false) }}
        style={{ bottom: percentHeight(5) }}
      >
        <TouchableWithoutFeedback onPress={() => { setShowAcceptReferral(false) }}>
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
            height: percentWidth(40),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: percentWidth(2),
          }}
        >
          <View style={{ height: '55%', justifyContent: 'center', alignItems: 'center', marginTop: -percentWidth(2) }}>
            <Text style={{ paddingTop: percentWidth(1), color: colors.text, fontSize: percentWidth(5), fontFamily: fonts.regular }}>
              {selectedReferral.referrerName}
            </Text>
            <Text style={{ paddingTop: percentWidth(1), color: 'gray', fontSize: percentWidth(4), fontFamily: fonts.regular }}>
              {selectedReferral.referrerEmail}
            </Text>
          </View>
          <View style={{ width: '93%', height: '30%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
            {
              loading
                ? <ActivityIndicator color={colors.primaryColor} size="large" />
                : (
                  <PillButton
                    onPress={() => acceptReferral(selectedReferral.id)}
                    titleSize={percentWidth(3.8)}
                    condition={selectedUser && Object.keys(selectedUser).length === 0}
                    title="CONFIRM"
                    width={percentWidth(34)}
                    height={percentWidth(10)}
                    gradient
                  />
                )
            }
            {
              declineLoading
                ? <ActivityIndicator color={colors.primaryColor} size="large" />
                : (
                  <PillButton
                    onPress={() => declineReferral(selectedReferral.id)}
                    titleSize={percentWidth(3.8)}
                    title="DECLINE"
                    gradientColors={['red', 'darkred']}
                    width={percentWidth(34)}
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
  giftItemContainer: {
    height: percentHeight(11),
    width: percentWidth(100),
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIcon: {
    borderRadius: percentWidth(3 / 5),
    width: percentWidth(18),
    height: percentWidth(11),
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftIconText: {
    fontSize: percentWidth(2.8),
    fontFamily: fonts.bold,
    color: 'white',
  },
  userInfoContainer: {
    paddingTop: percentWidth(5),
    paddingBottom: percentWidth(4),
    justifyContent: 'flex-end',
  },
  noReferralsContainer: {
    marginTop: percentWidth(15),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userInfoText: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: percentWidth(4),
  },
})
