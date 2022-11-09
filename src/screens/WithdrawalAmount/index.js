import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { format, localize } from 'app/lib/currency'
import { FullWidthButton } from 'app/components'
import { Icon } from 'react-native-elements'
import { fonts, colors, percentHeight, containers, percentWidth } from 'app/styles'

export default function WithdrawalAmount({ navigation }) {
  const [amount, setAmount] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [disabledDecimal, setDisabledDecimal] = useState(false)
  const [disabledZero, setDisabledZero] = useState(true)
  const [{ user, bankAccounts, currencies }] = getState()
  const symbol = navigation.getParam('symbol', 'USD')

  const handleWithdrawal = () => navigation.navigate('Withdrawal', { amount, symbol })
  const handleAddBankAccount = () => navigation.navigate('AddBankAccount', { amount, symbol })

  const handleNumberPress = (number) => {
    let newNumber
    if (!number) newNumber = amount.slice(0, -1)
    else newNumber = `${amount}${number}`
    if ((!!newNumber.split('.')[1] && newNumber.split('.')[1].length === currencies[symbol].decimals) || newNumber.length >= 7) setDisabled(true)
    else setDisabled(false)
    if (newNumber.includes('.') || !newNumber) setDisabledDecimal(true)
    else setDisabledDecimal(false)
    if (newNumber) setDisabledZero(false)
    else setDisabledZero(true)
    setAmount(newNumber)
  }

  const fontSizer = (fontSize) => {
    if (amount.length === 4) return fontSize * 0.92
    if (amount.length === 5) return fontSize * 0.86
    if (amount.length === 6) return fontSize * 0.80
    if (amount.length === 7) return fontSize * 0.74
    if (amount.length >= 8) return fontSize * 0.7
    return fontSize
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Enter Amount" navigation={navigation} />
      <View style={containers.screenContainer}>
        <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: 'rgba(0, 0, 0, 0.5)', position: 'absolute', alignSelf: 'center', top: percentWidth(12) }}>
          {symbol ? `Available balance: ${localize(user[`${symbol}Balance`], user.locales, currencies[symbol].decimals)} ${symbol}` : 'Enter Amount'}
        </Text>
        <View style={{ width: percentWidth(100), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.amount, { fontSize: fontSizer(percentWidth(14)) }]}>{`${format(amount, user.locales, currencies[symbol].decimals)}`}</Text>
            <Text style={[styles.character, { fontSize: fontSizer(percentWidth(7)) }]}>{` ${symbol}`}</Text>
          </View>
        </View>
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
                size={percentHeight(3)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <FullWidthButton
          onPress={bankAccounts.length === 0 ? handleAddBankAccount : handleWithdrawal}
          condition={!amount || amount > user[`${symbol}Balance`]}
          title="Next"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(15),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(8),
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
