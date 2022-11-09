import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, fonts, screenWidth, screenHeight } from 'app/styles'

export default function FullWidthButton({ onPress, condition, title, style }) {
  return (
    <LinearGradient
      colors={colors.walletGradient}
      start={{ x: -0.35, y: 0 }}
      end={{ x: 1.08, y: -0.09 }}
      locations={[0, 1]}
      style={[{ width: screenWidth, opacity: condition ? 0.5 : 1 }, style]}
    >
      <TouchableOpacity style={{ height: screenHeight * 0.08, justifyContent: 'center' }} onPress={onPress} disabled={condition}>
        <Text style={condition ? styles.inactiveTitle : styles.title}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  inactiveTitle: {
    color: colors.buttonText,
    fontFamily: fonts.semiBold,
    alignSelf: 'center',
    fontSize: 16,
    letterSpacing: -0.6,
    opacity: 0.5,
  },
  title: {
    color: colors.buttonText,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: -0.6,
  },
})
