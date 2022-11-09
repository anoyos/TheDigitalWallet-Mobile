import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Image } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { Button } from 'react-native-material-buttons'
import { format, localize } from 'app/lib/currency'
import { FullWidthButton } from 'app/components'
import { Icon } from 'react-native-elements'
import Modal from 'react-native-modal'
import { PAIRS } from 'app/lib/constants'
import Ethereum from 'app/lib/eth'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { fonts, colors, screenHeight, percentWidth, percentHeight, containers } from 'app/styles'

const SelectItem = ({ onPress, image, character, name, symbol }) => (
  <Button
    onPress={onPress}
    shadeBorderRadius={10}
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

export default function Exchange({ navigation }) {
  const [{ user, currencies }, dispatch] = getState()
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [exchangeRate, setExchangeRate] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [showFromCurrencies, setShowFromCurrencies] = useState(false)
  const [showToCurrencies, setShowToCurrencies] = useState(false)
  const [currency, setFromCurrency] = useState({})
  const [toCurrency, setToCurrency] = useState({})
  const [disabledDecimal, setDisabledDecimal] = useState(false)
  const [disabledZero, setDisabledZero] = useState(true)
  const [fromSymbol, setFromSymbol] = useState(navigation.getParam('symbol', user.currency.symbol))
  const [toSymbol, setToSymbol] = useState(user.currency.symbol)
  const [displayFromSymbol, setDisplayFromSymbol] = useState(fromSymbol)
  const [changeCurrencySymbol, setChangeCurrencySymbol] = useState(user.currency.symbol)
  const [availableBalance, setAvailableBalance] = useState(user[`${fromSymbol}Balance`])

  useEffect(() => {
    Ethereum.create(user).then((eth) => {
      eth.getNonce().then((nonce) => {
        dispatch({ type: 'setUser', payload: { nonce: parseInt(nonce, 10) + 1 } })
      }).catch((err) => console.log(err)) // eslint-disable-line no-console
    })
    api.getExchangeRate({ from: fromSymbol, to: toSymbol })
      .then((response) => setExchangeRate(response.rate))
      .catch(() => setExchangeRate(''))
    PAIRS.map((pair) => {
      if (pair.symbol === fromSymbol) setFromCurrency(pair)
      if (pair.symbol === toSymbol) setToCurrency(pair)
      return pair
    })
  }, [fromSymbol, toSymbol])

  const disableButton = () => {
    if (loading) return true
    if (displayFromSymbol !== fromSymbol && amount / exchangeRate > user[`${fromSymbol}Balance`]) return true
    if (displayFromSymbol === fromSymbol && amount > user[`${fromSymbol}Balance`]) return true
    if (!amount || !fromSymbol || toSymbol === fromSymbol || parseFloat(amount) === 0 || amount === '.') return true
    return false
  }

  const handleNext = async () => {
    setLoading(true)
    let checkedAmount = null
    if (displayFromSymbol === fromSymbol) checkedAmount = amount
    else checkedAmount = amount / exchangeRate
    try {
      const { exchangeParams } = await api.getExchange({ from: fromSymbol, to: toSymbol, amount: parseFloat(checkedAmount), nonce: user.nonce })
      setLoading(false)
      navigation.navigate('ConfirmExchange', { ...exchangeParams, symbol: fromSymbol, toCurrency: toSymbol, exchangeRate })
    } catch (err) {
      setLoading(false)
      toast.error(err)
    }
  }

  const handleCurrencyPress = (symbol) => {
    setAmount('')
    setDisabled(false)
    setDisabledDecimal(false)
    setDisabledZero(false)
    setFromSymbol(symbol)
    setDisplayFromSymbol(symbol)
    setChangeCurrencySymbol(user.currency.symbol)
    setAvailableBalance(user[`${symbol}Balance`])
    setShowFromCurrencies(false)
  }

  const handleToCurrencyPress = (symbol) => {
    setDisabled(false)
    setDisabledDecimal(false)
    setDisabledZero(false)
    setToSymbol(symbol)
    setChangeCurrencySymbol(symbol)
    setShowToCurrencies(false)
  }

  const handleChangeDisplayCurrency = () => {
    if (displayFromSymbol !== toSymbol) {
      const newAmount = (Math.round((amount * exchangeRate) * 10 ** currencies[toSymbol].decimals) / (10 ** currencies[toSymbol].decimals)).toString()
      if ((!!newAmount.split('.')[1] && newAmount.split('.')[1].length === currencies[toSymbol].decimals) || newAmount.length >= 7) setDisabled(true)
      else setDisabled(false)
      if (amount) setAmount(newAmount)
      setChangeCurrencySymbol(fromSymbol)
      setDisplayFromSymbol(toSymbol)
    } else {
      const newAmount = (Math.round((amount / exchangeRate) * 10 ** currencies[fromSymbol].decimals) / (10 ** currencies[fromSymbol].decimals)).toString()
      if ((!!newAmount.split('.')[1] && newAmount.split('.')[1].length === currencies[fromSymbol].decimals) || newAmount.length >= 7) setDisabled(true)
      else setDisabled(false)
      if (amount) setAmount(newAmount)
      setChangeCurrencySymbol(toSymbol)
      setDisplayFromSymbol(fromSymbol)
    }
  }

  const handleNumberPress = async (number) => {
    let newNumber
    if (!number) newNumber = amount.slice(0, -1)
    else newNumber = `${amount}${number}`
    if ((!!newNumber.split('.')[1] && newNumber.split('.')[1].length >= currencies[displayFromSymbol].decimals) || newNumber.length >= 7) setDisabled(true)
    else setDisabled(false)
    if (newNumber.includes('.')) setDisabledDecimal(true)
    else setDisabledDecimal(false)
    if (newNumber) setDisabledZero(false)
    else setDisabledZero(true)
    setAmount(newNumber)
  }

  const fontSizer = (fontSize) => {
    if (amount.length === 4) return fontSize * 0.92
    if (amount.length === 5) return fontSize * 0.84
    if (amount.length === 6) return fontSize * 0.79
    if (amount.length === 7) return fontSize * 0.74
    if (amount.length >= 8) return fontSize * 0.7
    return fontSize
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader
        title={fromSymbol === toSymbol ? 'Exchange' : `${fromSymbol} → ${toSymbol}`}
        titleSize={percentWidth(5)}
        navigation={navigation}
      />
      <View style={[containers.screenContainer, { justifyContent: 'flex-end' }]}>
        <View style={{ position: 'absolute', alignSelf: 'center', top: percentWidth(12) }}>
          <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: 'rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
            {fromSymbol ? `Available balance: ${localize(availableBalance, user.locales, currencies[fromSymbol].decimals)} ${fromSymbol}` : 'Enter Amount'}
          </Text>
          {fromSymbol !== toSymbol && (
            <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: 'rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
              {`1 ${fromSymbol} ≈ ${localize(exchangeRate, user.locales, currencies[toSymbol].decimals)} ${toSymbol}`}
            </Text>
          )}
        </View>
        <View style={{ width: percentWidth(100), justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.amount, { fontSize: fontSizer(percentWidth(13)) }]}>{`${format(amount, user.locales, currencies[displayFromSymbol].decimals)}`}</Text>
            <Text style={[styles.character, { fontSize: fontSizer(percentWidth(6.5)) }]}>{` ${displayFromSymbol}`}</Text>
          </View>
          {fromSymbol !== toSymbol && (
            <View style={{ position: 'absolute', right: percentWidth(5), alignItems: 'center' }}>
              <Button
                onPress={handleChangeDisplayCurrency}
                color="white"
                shadeBorderRadius={100}
                style={{
                  height: percentWidth(16),
                  width: percentWidth(16),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    name="long-arrow-up"
                    type="font-awesome"
                    color={colors.lightText}
                    size={percentWidth(6.5)}
                    // containerStyle={{ marginRight: -percentWidth(2) }}
                  />
                  <Icon
                    name="long-arrow-down"
                    type="font-awesome"
                    color={colors.lightText}
                    size={percentWidth(6.5)}
                    // containerStyle={{ marginLeft: -percentWidth(2) }}
                  />
                </View>
                <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.bold, color: colors.lightText }}>{changeCurrencySymbol}</Text>
              </Button>
            </View>
          )}
        </View>
        <Button
          onPress={() => setShowFromCurrencies(true)}
          color="white"
          style={{
            flexDirection: 'row',
            height: percentHeight(7),
            width: percentWidth(100),
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderTopWidth: 1,
          }}
        >
          <View style={{ width: '22%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={currency.image} style={{ width: percentWidth(9), height: percentWidth(9) }} />
          </View>
          <View style={{ width: '63%', justifyContent: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.1), fontFamily: fonts.regular, color: colors.text }}>
              {`${currency.name} ${currency.character ? `(${currency.character})` : ''}`}
            </Text>
          </View>
          <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={percentWidth(4)}
            />
          </View>
        </Button>
        <Button
          onPress={() => setShowToCurrencies(true)}
          color="white"
          style={{
            flexDirection: 'row',
            height: percentHeight(7),
            width: percentWidth(100),
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            justifyContent: 'space-between',
            marginBottom: percentHeight(1.5),
          }}
        >
          {fromSymbol !== toSymbol ? (
            <>
              <View style={{ width: '22%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={toCurrency.image} style={{ width: percentWidth(9), height: percentWidth(9) }} />
              </View>
              <View style={{ width: '63%', justifyContent: 'center' }}>
                <Text style={{ fontSize: percentWidth(4.1), fontFamily: fonts.regular, color: colors.text }}>
                  {`${toCurrency.name} ${toCurrency.character ? `(${toCurrency.character})` : ''}`}
                </Text>
              </View>
            </>
          ) : (
            <View style={{ width: '63%', justifyContent: 'center', paddingLeft: percentWidth(8) }}>
              <Text style={{ fontSize: percentWidth(4.1), fontFamily: fonts.regular, color: colors.text }}>
                Choose a to currency
              </Text>
            </View>
          )}
          <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={percentWidth(4)}
            />
          </View>
        </Button>
        <View style={{
          height: percentHeight(34),
          width: percentWidth(100),
          flexDirection: 'row',
        }}
        >
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('1')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('4')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('7')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('.')}
              disabled={disabledDecimal}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>.</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.insideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('2')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('5')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('8')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('0')}
              disabled={disabled || disabledZero}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.outsideColumn}>
            <TouchableOpacity
              onPress={() => handleNumberPress('3')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('6')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress('9')}
              disabled={disabled}
              style={styles.numberContainer}
            >
              <Text style={styles.number}>9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNumberPress(null)}
              style={styles.numberContainer}
            >
              <Icon
                name="backspace"
                type="material-community"
                color={colors.text}
                size={screenHeight * 0.03}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FullWidthButton
          onPress={handleNext}
          condition={disableButton()}
          title="Preview Exchange"
          loading={loading}
        />
      </View>
      <Modal
        isVisible={showFromCurrencies}
        onBackdropPress={() => setShowFromCurrencies(false)}
        useNativeDriver
      >
        <TouchableWithoutFeedback onPress={() => { setShowFromCurrencies(false) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>Choose a from currency</Text>
            <ScrollView>
              {
                PAIRS.filter((p) => p.symbol !== fromSymbol && p.symbol !== toSymbol).map((pair) => (
                  <SelectItem
                    key={`currency-${pair.id}`}
                    onPress={() => handleCurrencyPress(pair.symbol)}
                    image={pair.image}
                    character={pair.character}
                    name={pair.name}
                    symbol={pair.symbol}
                  />
                ))
              }
              <View style={{ height: percentHeight(2) }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={showToCurrencies}
        onBackdropPress={() => setShowToCurrencies(false)}
        useNativeDriver
      >
        <TouchableWithoutFeedback onPress={() => { setShowToCurrencies(false) }}>
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
            <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>Choose a to currency</Text>
            <ScrollView>
              {
                PAIRS.filter((p) => p.symbol !== toSymbol && p.symbol !== fromSymbol).map((pair) => (
                  <SelectItem
                    key={`currency-${pair.id}`}
                    onPress={() => handleToCurrencyPress(pair.symbol)}
                    image={pair.image}
                    character={pair.character}
                    name={pair.name}
                    symbol={pair.symbol}
                  />
                ))
              }
              <View style={{ height: percentHeight(2) }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  outsideColumn: { width: '33%' },
  insideColumn: { width: '34%' },
  number: {
    fontFamily: fonts.regular,
    fontSize: percentWidth(7),
    color: colors.text,
  },
})
