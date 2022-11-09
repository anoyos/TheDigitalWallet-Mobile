import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { Button } from 'react-native-material-buttons'
import { localize } from 'app/lib/currency'
import Ethereum from 'app/lib/eth'
import { FullWidthButton } from 'app/components'
import { PAIRS } from 'app/lib/constants'
import * as api from 'app/lib/api'
import { fonts, colors, screenHeight, screenWidth, percentWidth, percentHeight, containers } from 'app/styles'

const Item = ({ state, onPress, symbol, image, character, name }) => (
  <Button
    onPress={onPress}
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

export default function TransferWithAmount({ navigation }) {
  const [{ user, transfer, currencies }, dispatch] = getState()
  const [amount, setAmount] = useState(transfer.amount)
  const [loading, setLoading] = useState(false)
  const [symbol, setSymbol] = useState(transfer.toSymbol)

  useEffect(() => {
    Ethereum.create(user).then((eth) => {
      eth.getNonce().then((nonce) => {
        dispatch({ type: 'setUser', payload: { nonce: parseInt(nonce, 10) + 1 } })
      }).catch((err) => console.log(err)) // eslint-disable-line no-console
    })
  }, [])

  const handleNext = async () => {
    setLoading(true)
    if (transfer.toSymbol === symbol) {
      const convertedAmount = (Math.round(amount * 1000000) / 1000000).toString()
      const payload = { amount: convertedAmount, fromSymbol: transfer.toSymbol }
      dispatch({ type: 'setTransfer', payload })
      setLoading(false)
      navigation.navigate('ConfirmTransfer', { businessName: transfer.name })
    } else {
      const { exchangeParams } = await api.getExchange({ from: symbol, to: transfer.toSymbol, amount: parseFloat(amount), nonce: user.nonce })
      const { rate } = await api.getExchangeRate({ from: symbol, to: transfer.toSymbol })
      setLoading(false)
      navigation.navigate('ConfirmExchangeAndTransfer', { ...exchangeParams, fromSymbol: symbol, exchangeRate: rate, businessName: transfer.name })
    }
  }

  const handleSelectCurrency = async (selectedSymbol) => {
    setSymbol(selectedSymbol)
    if (transfer.toSymbol === selectedSymbol) return
    const { rate } = await api.convertCurrencies({ from: selectedSymbol, to: transfer.toSymbol, amount: parseFloat(amount) })
    const eth = await Ethereum.create(user)
    const [dividend, divisor] = await eth.getExchangeFeeScalar(user.walletAddress, selectedSymbol, transfer.toSymbol)
    setAmount(transfer.amount / (parseInt(dividend, 10) / parseInt(divisor, 10)) / rate)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title={symbol ? `${localize(user[`${symbol}Balance`], user.locales, currencies[symbol].decimals)} ${symbol}` : 'Enter Amount'} navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ height: percentHeight(13), width: percentWidth(100), justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.amount}>
              {
                transfer.toSymbol === symbol
                  ? `${amount && localize(transfer.amount, user.locales, currencies[symbol].decimals)}`
                  : `${amount && localize(amount, user.locales, currencies[symbol].decimals)}`
              }
            </Text>
            <Text style={styles.character}>{` ${currencies[symbol].displaySymbol}`}</Text>
          </View>
        </View>
        <View style={{ height: percentHeight(50), marginVertical: percentHeight(3) }}>
          <ScrollView>
            {
              PAIRS.map((pair) => (
                <Item
                  key={`currency-${pair.id}`}
                  image={pair.image}
                  character={pair.character}
                  onPress={() => handleSelectCurrency(pair.symbol)}
                  symbol={pair.symbol}
                  state={symbol}
                  name={pair.name}
                />
              ))
            }
            <View style={{ height: percentHeight(2) }} />
          </ScrollView>
        </View>
        <View style={{ backgroundColor: colors.bgColor, position: 'absolute', bottom: 0, width: screenWidth }}>
          <FullWidthButton
            onPress={handleNext}
            condition={!symbol || amount > user[`${symbol}Balance`]}
            title="Next"
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(12),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(6),
  },
  numberContainer: {
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberColumn: { width: '33.33%' },
  number: {
    fontFamily: fonts.semiBold,
    fontSize: screenHeight * 0.04,
    color: colors.text,
  },
})
