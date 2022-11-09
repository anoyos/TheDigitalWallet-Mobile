/* eslint-disable no-alert */
import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PAIRS, GIFT_CARDS } from 'app/lib/constants'
import { Button } from 'react-native-material-buttons'
import Ethereum from 'app/lib/eth'
import { SubHeader } from 'app/components/Headers'
import { PillButton, Input, FullWidthButton } from 'app/components'
import { getState } from 'app/lib/react-simply'
import { localize } from 'app/lib/currency'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { colors, fonts, percentWidth, percentHeight, text, containers } from 'app/styles'
import Carousel from 'react-native-snap-carousel'

const SelectCurrencyItem = ({ state, setter, symbol, image, character, name }) => (
  <Button
    onPress={() => setter(symbol)}
    shadeBorderRadius={10}
    disabled={state === symbol}
    color="white"
    style={{
      flexDirection: 'row',
      width: percentWidth(75),
      height: percentWidth(10),
      alignSelf: 'center',
      marginVertical: percentWidth(1),
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    }}
  >
    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={image} style={{ width: percentWidth(8), height: percentWidth(8) }} />
    </View>
    <View style={{ width: '46.66%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text }}>{name}</Text>
    </View>
    <View style={{ width: '33.33%', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text }}>{character ? `${symbol} (${character})` : `${symbol}`}</Text>
    </View>
  </Button>
)

const Item = ({ setShowCurrencies, image, name }) => (
  <Button
    onPress={() => setShowCurrencies(true)}
    color="white"
    style={{
      flexDirection: 'row',
      width: percentWidth(85),
      height: percentWidth(12),
      marginVertical: percentWidth(1),
      borderColor: colors.inputBorder,
      borderWidth: 1,
      backgroundColor: '#FFF',
      alignSelf: 'center',
      borderRadius: percentWidth(3),
    }}
  >
    {
      name === ''
        ? (
          <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '85%' }}>
            <Text
              style={{
                color: colors.lightText,
                fontFamily: fonts.regular,
                fontSize: percentWidth(3.7),
              }}
            >
              Select currency
            </Text>
          </View>
        ) : (
          <>
            <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={image} style={{ width: percentWidth(6), height: percentWidth(6) }} />
            </View>
            <View style={{ right: '20%', width: '80%', justifyContent: 'center', paddingRight: percentWidth(1) }}>
              <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text, marginLeft: percentWidth(2) }}>{name}</Text>
            </View>
          </>
        )
    }
  </Button>
)

export default function GiftCardScreen({ navigation }) {
  const [{ user, currencies }, dispatch] = getState()
  const [purchaseGiftLoading, setPurchaseGiftLoading] = useState(false)
  const [showCurrencies, setShowCurrencies] = useState(false)
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false)
  const [currency, setCurrency] = useState({ id: 0, symbol: '', name: '', image: null, character: '' })
  const [amount, setAmount] = useState('')
  const [receiverEmail, setReceiverEmail] = useState('')
  const [receiverMessage, setReceiverMessage] = useState('')
  const [currentGiftCardSelectionIndex, setCurrentGiftCardSelectionIndex] = useState(0)

  const updateGiftCards = async () => {
    try {
      const pendingResponse = await api.getPendingGiftCards()
      const acceptedResponse = await api.getAcceptedGiftCards()
      dispatch({ type: 'setPendingGiftCards', payload: pendingResponse.pending })
      dispatch({ type: 'setAcceptedGiftCards', payload: acceptedResponse.accepted })
    } catch (err) {
      toast.error(err)
    }
  }

  const handleBuyGiftCardPress = () => {
    const regexOneDecimal = /^[0-9]*.[0-9]*$/
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!regexEmail.test(receiverEmail)) {
      alert('Check to make sure that the email address you entered is correctly formatted; eg. test@email.com')
    } else if (!regexOneDecimal.test(amount)) {
      alert('Check to make sure that the amount is correctly formatted; eg. 123.456')
    } else {
      setShowConfirmPurchase(true)
    }
  }

  const handleConfirmPurchase = async () => {
    setPurchaseGiftLoading(true)
    const eth = await Ethereum.create(user)
    const response = await api.getUserInfo(receiverEmail.toLowerCase())
    const params = {
      type: GIFT_CARDS[currentGiftCardSelectionIndex].name,
      symbol: currency.symbol,
      amount: parseFloat(amount),
      receiver_email: receiverEmail.toLowerCase(),
      receiver_message: receiverMessage,
    }

    if (response.user) {
      params.aws_user_id = response.user.Username
      const salt = parseInt(Math.random().toString().slice(-5), 10)
      try {
        await eth.digitallTransfer(response.user.Attributes[1].Value, amount, salt, currency.symbol)
        await api.createGiftCard(params)
        navigation.navigate('Wallets')
      } catch (err) {
        toast.error(err)
      }
    } else {
      try {
        await eth.buyGiftCard(amount, currency.symbol)
        await api.createPendingGiftCard(params)
        navigation.navigate('Wallets')
      } catch (err) {
        toast.error(err)
      }
    }

    await updateGiftCards()
    setPurchaseGiftLoading(false)
    setShowConfirmPurchase(false)
  }

  const handleSelectCurrencyPress = (state) => {
    setCurrency(PAIRS.filter((x) => x.symbol === state)[0])
    setTimeout(() => setShowCurrencies(false), 100)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Send a Gift" navigation={navigation} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        extraScrollHeight={percentWidth(2)}
        contentContainerStyle={containers.screenContainer}
        enableOnAndroid
      >
        <View style={{ flexDirection: 'row', top: percentHeight(1), paddingTop: percentHeight(2), marginBottom: percentHeight(2), justifyContent: 'space-between', marginHorizontal: percentHeight(2) }}>
          <Text style={text.header}>SELECT EVENT TYPE</Text>
          <Text style={{ color: '#7A1720', fontSize: percentWidth(4.2), fontFamily: fonts.semiBold }}>
            {currency.symbol ? `${localize(user[`${currency.symbol}Balance`], user.locales, currencies[currency.symbol].decimals)} ${currency.symbol}` : ''}
          </Text>
        </View>
        <View style={{ height: percentHeight(28), paddingTop: percentWidth(2) }}>
          <Carousel
            sliderWidth={percentWidth(100)}
            itemWidth={percentWidth(95)}
            slideStyle={{ justifyContent: 'center', alignItems: 'center' }}
            inactiveSlideOpacity={0}
            swipeThreshold={0}
            data={GIFT_CARDS}
            onSnapToItem={(slideIndex) => { setCurrentGiftCardSelectionIndex(slideIndex) }}
            renderItem={({ item }) => (
              <Image
                style={
                  {
                    borderRadius: percentWidth(3),
                    width: percentWidth(70),
                    height: percentWidth(40),

                  }
                }
                source={item.image}
              />
            )}
          />
          <Text style={{ textAlign: 'center', color: '#7A1720', fontFamily: fonts.bold, fontSize: percentWidth(4.1) }}>
            Swipe to select your personalized gift card
          </Text>
        </View>
        <View style={{ height: percentHeight(32), marginTop: percentHeight(2), justifyContent: 'space-between' }}>
          <Item setShowCurrencies={setShowCurrencies} image={currency.image} name={currency.name} />
          <Input
            keyboardType="numeric"
            returnKeyType="done"
            placeholder={`0.00 ${currency.symbol}`}
            onChangeText={(value) => setAmount(value)}
            value={amount}
            autoCorrect={false}
            height={12}
            width={85}
            borderRadius={3}
          />
          <Input
            placeholder="Email"
            onChangeText={(value) => setReceiverEmail(value)}
            value={receiverEmail}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="email-address"
            height={12}
            width={85}
            borderRadius={3}
          />
          <Input
            placeholder="Add a message (optional)"
            onChangeText={(value) => setReceiverMessage(value)}
            value={receiverMessage}
            autoCorrect={false}
            multiline
            numberOfLines={3}
            height={percentHeight(4)}
            width={85}
            borderRadius={3}
            blurOnSubmit
            returnKeyType="done"
          />
        </View>
        <SafeAreaView forceInset={{ bottom: percentHeight(1.9) }} style={{ height: percentHeight(6), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgColor, position: 'absolute', bottom: 0, width: percentWidth(100) }}>
          <FullWidthButton
            gradient
            width={percentWidth(50)}
            title="SEND NOW"
            condition={!amount || !receiverEmail || !currency.symbol || user[`${currency.symbol}Balance`] < parseInt(amount, 10)}
            onPress={handleBuyGiftCardPress}
          />
        </SafeAreaView>
      </KeyboardAwareScrollView>
      <Modal
        isVisible={showCurrencies}
        onBackdropPress={() => { setShowCurrencies(false) }}
        useNativeDriver
      >
        <TouchableWithoutFeedback onPress={() => { setShowCurrencies(false) }}>
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
            height: percentWidth(100),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 15,
          }}
        >
          <View style={{ height: percentWidth(90) }}>
            <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>Select A Currency</Text>
            <ScrollView>
              {
                PAIRS.filter((p) => p.name !== '').map((pair) => (
                  <SelectCurrencyItem
                    key={`currency-${pair.id}`}
                    image={pair.image}
                    character={pair.character}
                    setter={handleSelectCurrencyPress}
                    symbol={pair.symbol}
                    name={pair.name}
                    currentState={currency.symbol}
                  />
                ))
              }
              <View style={{ height: percentHeight(2) }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={showConfirmPurchase}
        useNativeDriver
        onSwipeComplete={() => setShowConfirmPurchase(false)}
        swipeThreshold={50}
        swipeDirection={['up', 'down', 'right', 'left']}
        onBackdropPress={() => { setShowConfirmPurchase(false) }}
      >
        <TouchableWithoutFeedback onPress={() => { setShowConfirmPurchase(false) }}>
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
            <Text style={{ paddingTop: percentWidth(1), color: colors.text, fontSize: percentWidth(7), fontFamily: fonts.regular }}>{`${amount} ${currency.symbol}`}</Text>
            <Text style={{ color: colors.primaryColor, fontSize: percentWidth(3), fontFamily: fonts.regular }}>{receiverEmail}</Text>
          </View>
          <View style={{ height: '30%', justifyContent: 'center', alignItems: 'center' }}>
            {
              purchaseGiftLoading
                ? <ActivityIndicator color={colors.primaryColor} size="large" />
                : (
                  <PillButton
                    onPress={handleConfirmPurchase}
                    titleSize={percentWidth(3.8)}
                    title="Purchase Gift Card"
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
    fontSize: percentWidth(5),
    fontFamily: fonts.bold,
    color: 'white',
  },
  userInfoContainer: {
    paddingTop: percentWidth(5),
    paddingBottom: percentWidth(4),
    justifyContent: 'flex-end',
  },
  userInfoText: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: percentWidth(4),
  },
})
