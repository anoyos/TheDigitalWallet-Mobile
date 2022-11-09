import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import { getState } from 'app/lib/react-simply'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LinearGradient from 'react-native-linear-gradient'
import { colors, fonts, screenWidth } from 'app/styles'

export default function Promotion({ navigation }) {
  const [{ user, businesses }] = getState()
  const { description, name, imageUrl, amountFacevalue, type, id, businessId } = navigation.state.params
  const business = businesses.filter(b => b.id === businessId)[0]

  const Offer = () => (
    <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <SubHeader title="Upgrade" navigation={navigation} />
      <KeyboardAwareScrollView extraScrollHeight={20} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>PROGRESS</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{
            height: 20,
            width: screenWidth * 0.8,
            backgroundColor: colors.lightText,
            alignSelf: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}
          />
          <LinearGradient
            colors={colors.walletGradient}
            style={{
              height: 20,
              width: (screenWidth * 0.8) * user.balance / amountFacevalue,
              maxWidth: screenWidth * 0.8,
              backgroundColor: colors.blue,
              alignSelf: 'center',
              borderRadius: 5,
              position: 'absolute',
              left: screenWidth * 0.1,
            }}
            useAngle
            angle={55}
          />
        </View>
        {!!description && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>DETAILS</Text>
            </View>
            <View style={styles.detailsContainer}>
              <ScrollView>
                <Text style={styles.detailsText}>{description}</Text>
              </ScrollView>
            </View>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <PillButton
            width={220}
            title="Redeem"
            condition={user.balance < amountFacevalue}
            onPress={() => navigation.navigate('ConfirmTransfer', {
              toAddress: business.address,
              memo: name,
              amount: amountFacevalue,
              name: business.name,
              offer: true,
              promotionId: id,
            })}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )

  const Referral = () => (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SubHeader title="Upgrade" navigation={navigation} />
      <KeyboardAwareScrollView extraScrollHeight={20} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>PROGRESS</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <View style={{
            height: 20,
            width: screenWidth * 0.8,
            backgroundColor: colors.lightText,
            alignSelf: 'center',
            borderRadius: 5,
            position: 'absolute',
          }}
          />
          <LinearGradient
            colors={colors.walletGradient}
            style={{
              height: 20,
              width: (screenWidth * 0.8) * user.availableReferrals / amountFacevalue,
              maxWidth: screenWidth * 0.8,
              backgroundColor: colors.blue,
              alignSelf: 'center',
              borderRadius: 5,
              position: 'absolute',
              left: screenWidth * 0.1,
            }}
            useAngle
            angle={55}
          />
        </View>
        {!!description && (
          <View>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>DETAILS</Text>
            </View>
            <View style={styles.detailsContainer}>
              <ScrollView>
                <Text style={styles.detailsText}>{description}</Text>
              </ScrollView>
            </View>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <PillButton
            width={220}
            title="Redeem"
            condition={user.availableReferrals < amountFacevalue}
            onPress={() => {
              navigation.navigate('ConfirmTransfer', {
                toAddress: '#GUMPmovement',
                memo: name,
                amount: amountFacevalue,
                name: '#GUMPchange',
                referral: true,
                promotionId: id,
              })
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )

  switch (type) {
    case 'offer':
      return Offer()
    case 'referral':
      return Referral()
    default:
      return (
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <SubHeader title="Upgrade" navigation={navigation} />
          <ScrollView style={{ flex: 1, paddingTop: 10 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.incorrectData}>Oops! Something is not correct.</Text>
              <Text style={styles.incorrectData}>Please reload and try again.</Text>
            </View>
          </ScrollView>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.95,
    height: screenWidth * 0.633,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 10,
  },
  detailsContainer: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    height: 150,
    backgroundColor: colors.inputBackground,
    padding: 15,
  },
  image: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.633,
    borderRadius: 10,
  },
  sectionTitleContainer: {
    left: 17,
    marginTop: 20,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  incorrectData: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  sectionTitle: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  detailsText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  qrContainer: {
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 208,
    width: 208,
    marginTop: 10,
  },
})
