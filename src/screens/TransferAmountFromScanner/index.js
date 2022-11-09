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
import Ethereum from 'app/lib/eth'
import { PAIRS } from 'app/lib/constants'
// import { Decimal } from 'decimal.js'
import * as api from 'app/lib/api'
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

export default function TransferAmountFromScanner({ navigation }) {
  const [amount, setAmount] = useState('')
  const scannerSymbol = navigation.getParam('symbol', false)
  const [exchangeRate, setExchangeRate] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [showCurrencies, setShowCurrencies] = useState(false)
  const [currency, setCurrency] = useState({})
  const [disabledDecimal, setDisabledDecimal] = useState(false)
  const [disabledZero, setDisabledZero] = useState(true)
  const [{ user, currencies, transfer }, dispatch] = getState()
  const [currencySymbol, setCurrencySymbol] = useState(scannerSymbol || transfer.toSymbol)
  const [displayCurrencySymbol, setDisplayCurrencySymbol] = useState(transfer.toSymbol)
  const [changeCurrencySymbol, setChangeCurrencySymbol] = useState(currencySymbol)
  const [availableBalance, setAvailableBalance] = useState(user[`${currencySymbol}Balance`])

  useEffect(() => {
    api.getExchangeRate({ from: currencySymbol, to: transfer.toSymbol })
      .then((response) => setExchangeRate(response.rate))
      .catch(() => setExchangeRate(''))
    PAIRS.map((pair) => {
      if (pair.symbol === currencySymbol) setCurrency(pair)
      return pair
    })
  }, [currencySymbol])

  const handleNext = async () => {
    let checkedAmount = null
    if (transfer.toSymbol === currencySymbol) {
      if (displayCurrencySymbol === currencySymbol) checkedAmount = amount
      else checkedAmount = amount / exchangeRate
      const payload = { amount: (Math.round(checkedAmount * (10 ** currencies[currencySymbol].decimals)) / (10 ** currencies[currencySymbol].decimals)).toString(), fromSymbol: currencySymbol }
      dispatch({ type: 'setTransfer', payload })
      navigation.navigate('ConfirmTransfer')
    } else {
      const { toAmount, rate } = await api.convertCurrencies({ from: currencySymbol, to: transfer.toSymbol, amount: parseFloat(amount) })
      const eth = await Ethereum.create(user)
      const nonce = await eth.getNonce()
      const [dividend, divisor] = await eth.getExchangeFeeScalar(user.walletAddress, currencySymbol, transfer.toSymbol)

      if (displayCurrencySymbol === currencySymbol) {
        checkedAmount = Math.round(parseFloat(toAmount) * (10 ** currencies[currencySymbol].decimals)) / (10 ** currencies[currencySymbol].decimals)
      } else {
        checkedAmount = parseFloat(amount)
      }

      const fromTotal = (checkedAmount / (parseInt(dividend, 10) / parseInt(divisor, 10))) / rate
      const { exchangeParams, rate: exParamsRate } = await api.getExchange({ from: currencySymbol, to: transfer.toSymbol, amount: fromTotal, nonce: parseInt(nonce, 10) + 1 })

      const payload = { amount: (Math.round(fromTotal * (10 ** currencies[currencySymbol].decimals)) / (10 ** currencies[currencySymbol].decimals)).toString(), fromSymbol: currencySymbol }
      dispatch({ type: 'setTransfer', payload })
      navigation.navigate('ConfirmExchangeAndTransfer', { ...exchangeParams, fromSymbol: currencySymbol, exchangeRate })
    }
  }

  const handleCurrencyPress = (symbol) => {
    setAmount('')
    setDisabled(false)
    setDisabledDecimal(false)
    setDisabledZero(false)
    setCurrencySymbol(symbol)
    setDisplayCurrencySymbol(symbol)
    setChangeCurrencySymbol(transfer.toSymbol)
    setAvailableBalance(user[`${symbol}Balance`])
    setShowCurrencies(false)
  }

  const handleChangeDisplayCurrency = () => {
    if (displayCurrencySymbol !== transfer.toSymbol) {
      const newAmount = (Math.round((amount * exchangeRate) * (10 ** currencies[transfer.toSymbol].decimals)) / (10 ** currencies[transfer.toSymbol].decimals)).toString()
      if ((!!newAmount.split('.')[1] && newAmount.split('.')[1].length === currencies[transfer.toSymbol].decimals) || newAmount.length >= 7) setDisabled(true)
      else setDisabled(false)
      if (amount) setAmount(newAmount)
      setChangeCurrencySymbol(currencySymbol)
      setDisplayCurrencySymbol(transfer.toSymbol)
    } else {
      const newAmount = (Math.round((amount / exchangeRate) * (10 ** currencies[currencySymbol].decimals)) / (10 ** currencies[currencySymbol].decimals)).toString()
      if ((!!newAmount.split('.')[1] && newAmount.split('.')[1].length === currencies[currencySymbol].decimals) || newAmount.length >= 7) setDisabled(true)
      else setDisabled(false)
      if (amount) setAmount(newAmount)
      setChangeCurrencySymbol(transfer.toSymbol)
      setDisplayCurrencySymbol(currencySymbol)
    }
  }

  const handleNumberPress = (number) => {
    let newNumber
    if (!number) newNumber = amount.slice(0, -1)
    else newNumber = `${amount}${number}`
    if ((!!newNumber.split('.')[1] && newNumber.split('.')[1].length >= currencies[displayCurrencySymbol].decimals) || newNumber.length >= 7) setDisabled(true)
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

  const disableButton = () => {
    if (displayCurrencySymbol !== currencySymbol && amount / exchangeRate > user[`${currencySymbol}Balance`]) return true
    if (displayCurrencySymbol === currencySymbol && amount > user[`${currencySymbol}Balance`]) return true
    if (!amount || !currencySymbol || amount === '0.') return true
    return false
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader
        title={`${transfer.toSymbol} Requested`}
        titleSize={percentWidth(5)}
        navigation={navigation}
      />
      <View style={[containers.screenContainer, { justifyContent: 'flex-end' }]}>
        <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: 'rgba(0, 0, 0, 0.5)', position: 'absolute', alignSelf: 'center', top: percentWidth(12) }}>
          {currencySymbol ? `Available balance: ${localize(availableBalance, user.locales, currencies[currencySymbol].decimals)} ${currencySymbol}` : 'Enter Amount'}
        </Text>
        <View style={{ width: percentWidth(100), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.amount, { fontSize: fontSizer(percentWidth(13)) }]}>{`${format(amount, user.locales, currencies[displayCurrencySymbol].decimals)}`}</Text>
            <Text style={[styles.character, { fontSize: fontSizer(percentWidth(6.5)) }]}>{` ${currencies[displayCurrencySymbol].displaySymbol}`}</Text>
          </View>
          {currencySymbol !== transfer.toSymbol && (
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
                  />
                  <Icon
                    name="long-arrow-down"
                    type="font-awesome"
                    color={colors.lightText}
                    size={percentWidth(6.5)}
                  />
                </View>
                <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.bold, color: colors.lightText }}>{currencies[changeCurrencySymbol].displaySymbol}</Text>
              </Button>
            </View>
          )}
        </View>
        <View style={{ alignSelf: 'center', width: percentWidth(90), marginBottom: percentWidth(1) }}>
          <Text style={{ fontSize: percentWidth(3), color: 'rgba(0, 0, 0, 0.4)', fontFamily: fonts.regular, textAlign: 'center' }}>
            {`${transfer.name} will receive ${transfer.toSymbol}. If you would like to send them tokens from a different wallet they will first be converted from ${currencySymbol} and then sent to ${transfer.name}'s wallet.`}
          </Text>
        </View>
        <Button
          onPress={() => setShowCurrencies(true)}
          color="white"
          style={{
            flexDirection: 'row',
            height: percentHeight(9),
            width: percentWidth(100),
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            marginBottom: percentHeight(1.5),
          }}
        >
          <View style={{ width: '22%', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={currency.image} style={{ width: percentWidth(9), height: percentWidth(9) }} />
          </View>
          <View style={{ width: '63%', justifyContent: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.1), fontFamily: fonts.regular, color: colors.text }}>
              {`${currency.name} ${currency.character ? `(${currency.character})` : ''}`}
            </Text>
            {currencySymbol !== transfer.toSymbol && (
              <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: 'rgba(0, 0, 0, 0.5)' }}>
                {`1 ${currencies[currencySymbol].displaySymbol} ≈ ${localize(exchangeRate, user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.toSymbol}`}
              </Text>
            )}
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
          title="Preview transfer"
        />
      </View>
      <Modal
        isVisible={showCurrencies}
        onBackdropPress={() => setShowCurrencies(false)}
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
