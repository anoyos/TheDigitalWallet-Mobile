import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { LoadingModal } from 'app/components'
import { getState } from 'app/lib/react-simply'
import SafeAreaView from 'react-native-safe-area-view'
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements'
import { updateAttributes } from 'app/lib/auth'
import * as toast from 'app/lib/toast'
import { colors, screenHeight, fonts, percentWidth, containers, percentHeight } from 'app/styles'

export default function ConfirmNewPin({ navigation }) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [{ user }, dispatch] = getState()

  const handleNext = async () => {
    setLoading(true)
    updateAttributes({ attributes: [{ Name: 'custom:pin', Value: pin }] }, async (err) => {
      try {
        if (err) throw err

        const newUser = { ...user, pin }
        const stringUser = JSON.stringify(newUser)
        await AsyncStorage.setItem('user', stringUser)
        dispatch({ type: 'setUser', payload: { pin } })
        if (!user.isCustomer) navigation.navigate('Cashier')
        else navigation.navigate('Wallets')
      } catch (e) {
        toast.error(e)
      }
    })
  }

  useEffect(() => {
    if (pin === user.pin) handleNext()
  }, [pin])

  const handleNumberPress = (number) => {
    let newNumber
    if (!number) newNumber = pin.slice(0, -1)
    else newNumber = `${pin}${number}`
    if (newNumber.length >= 6) setDisabled(true)
    else setDisabled(false)
    setPin(newNumber)
  }

  const Circle = () => (
    <View
      style={{
        height: percentWidth(7.2),
        width: percentWidth(7.2),
        marginHorizontal: percentWidth(1),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.primaryColor,
        backgroundColor: colors.bgColor,
      }}
    />
  )

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Confirm Security PIN" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Text
            style={{
              fontFamily: fonts.muliBold,
              color: 'rgba(0,0,19,0.5)',
              fontSize: percentWidth(4.5),
              bottom: percentWidth(13),
              textAlign: 'center',
            }}
          >
            Confirm Security PIN
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
            {pin.charAt(0) ? <Text style={styles.pin}>{pin.charAt(0)}</Text> : <Circle />}
            {pin.charAt(1) ? <Text style={styles.pin}>{pin.charAt(1)}</Text> : <Circle />}
            {pin.charAt(2) ? <Text style={styles.pin}>{pin.charAt(2)}</Text> : <Circle />}
            {pin.charAt(3) ? <Text style={styles.pin}>{pin.charAt(3)}</Text> : <Circle />}
            {pin.charAt(4) ? <Text style={styles.pin}>{pin.charAt(4)}</Text> : <Circle />}
            {pin.charAt(5) ? <Text style={styles.pin}>{pin.charAt(5)}</Text> : <Circle />}
          </View>
        </View>
        <View style={{
          height: percentHeight(34),
          width: percentWidth(100),
          marginBottom: percentHeight(12),
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
              disabled={disabled}
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
        <LoadingModal loading={loading} loadingMessage="Changing PIN..." />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  pin: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.09,
  },
  pinCircle: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.05,
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    top: -screenHeight * 0.01,
    fontSize: screenHeight * 0.05,
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
