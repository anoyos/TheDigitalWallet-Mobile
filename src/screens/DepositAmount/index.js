import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { format } from 'app/lib/currency'
import { FullWidthButton, LoadingModal } from 'app/components'
import Ethereum from 'app/lib/eth'
import { Icon } from 'react-native-elements'
import { fonts, colors, screenHeight, screenWidth, percentWidth, percentHeight, containers } from 'app/styles'

export default function TransferAmount({ navigation }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const symbol = navigation.getParam('symbol', false)
  const [disabled, setDisabled] = useState(false)
  const [disabledDecimal, setDisabledDecimal] = useState(false)
  const [disabledZero, setDisabledZero] = useState(true)
  const [{ user, currencies }] = getState()

  const handleDeposit = async () => {
    setLoading(true)
    const eth = await Ethereum.create(user)
    await eth.deposit(parseFloat(amount), symbol)
    navigation.navigate('Wallets')
  }

  const handleNumberPress = (number) => {
    let newNumber
    if (!number) newNumber = amount.slice(0, -1)
    else newNumber = `${amount}${number}`
    if ((!!newNumber.split('.')[1] && newNumber.split('.')[1].length === 4) || newNumber.length >= 7) setDisabled(true)
    else setDisabled(false)
    if (newNumber.includes('.')) setDisabledDecimal(true)
    else setDisabledDecimal(false)
    if (newNumber) setDisabledZero(false)
    else setDisabledZero(true)
    setAmount(newNumber)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Enter Amount" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ height: percentHeight(13), width: percentWidth(100), justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.amount}>{`${format(amount, user.locales)}`}</Text>
            <Text style={styles.character}>{` ${currencies[symbol].displaySymbol}`}</Text>
          </View>
        </View>
        <View style={{
          height: percentHeight(37),
          marginTop: percentHeight(1),
          width: '90%',
          flexDirection: 'row',
          alignSelf: 'center',
        }}
        >
          <View style={styles.numberColumn}>
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
          <View style={styles.numberColumn}>
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
          <View style={styles.numberColumn}>
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
        <View style={{ backgroundColor: colors.bgColor, position: 'absolute', bottom: 0, width: screenWidth }}>
          <FullWidthButton
            onPress={handleDeposit}
            title="Deposit"
          />
        </View>
      </View>
      <LoadingModal loading={loading} loadingMessage={`Depositing ${amount} ${symbol}...`} />
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
