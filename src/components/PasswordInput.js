import React, { useState } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, TextInput, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { colors, fonts, percentWidth, screenWidth, shadow } from 'app/styles'

export default function PasswordInput({
  value,
  placeholder,
  onChangeText,
  textContentType,
  oneUppercaseLetter,
  eightCharacters,
  validation,
  width = 85,
}) {
  const [visibility, setVisibility] = useState('eye-slash')
  const [secure, setSecure] = useState(true)

  const handleShowPasswordPress = () => {
    if (secure) {
      setVisibility('eye')
      setSecure(false)
    } else {
      setVisibility('eye-slash')
      setSecure(true)
    }
  }

  return (
    <View style={[styles.input, {width: percentWidth(width) }]}>
      <TextInput
        autoCorrect={false}
        underlineColorAndroid="rgba(0,0,0,0)"
        placeholderTextColor={colors.lightText}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        style={styles.textContainer}
        textContentType={textContentType}
        collapsable={false}
      />
      {
        validation && (
          <View style={{ alignSelf: 'center' }}>
            {!eightCharacters && <Text style={{ fontSize: percentWidth(2.5), color: 'red', fontFamily: fonts.regular }}>Must be at least 8 characters.</Text>}
            {!oneUppercaseLetter && <Text style={{ fontSize: percentWidth(2.5), color: 'red', fontFamily: fonts.regular }}>1 uppercase letter required.</Text>}
          </View>
        )
      }
      <TouchableWithoutFeedback onPress={() => handleShowPasswordPress()}>
        <View style={styles.iconContainer}>
          <Icon
            name={visibility}
            type="font-awesome"
            iconStyle={{ alignSelf: 'center' }}
            color={colors.text}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: screenWidth * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    marginVertical: 4,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: percentWidth(3),
    height: percentWidth(12),
    width: percentWidth(70),
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 0,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: percentWidth(4.1),
    marginLeft: screenWidth * 0.05,
    width: screenWidth * 0.85,
  },
})
