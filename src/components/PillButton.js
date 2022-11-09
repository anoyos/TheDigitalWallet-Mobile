import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Text, StyleSheet } from 'react-native'
import { fonts, colors, shadow } from 'app/styles'
import { Button } from 'react-native-material-buttons'

export default function PillButton({
  onPress,
  title,
  width,
  height = 42,
  gradient,
  gradientColors = colors.walletGradient,
  bgColor,
  titleSize = 15,
  condition,
  borderRadius = 25,
  center,
  titleColor,
  fontFamily,
  marginVertical = 10,
}) {
  if (gradient) {
    return (
      <Button
        onPress={onPress}
        shadeBorderRadius={borderRadius}
        disabled={condition}
        style={[{ marginVertical, width, height, borderRadius, ...shadow, alignSelf: center ? 'center' : 'auto' }, styles.button]}
      >
        <LinearGradient
          style={[{ width, height, borderRadius, opacity: condition ? 0.5 : 1 }, styles.button]}
          colors={gradientColors}
          useAngle
          angle={40}
        >
          <Text style={[{ fontSize: titleSize, color: titleColor || colors.buttonText }, styles.buttonText]}>{title}</Text>
        </LinearGradient>
      </Button>
    )
  }
  return (
    <Button
      disabled={condition}
      shadeBorderRadius={borderRadius}
      onPress={onPress}
      shadeColor="#000"
      shadeOpacity={0.5}
      style={[{
        width,
        height,
        borderRadius,
        opacity: condition ? 0.5 : 1,
        alignSelf: center ? 'center' : 'auto',
        backgroundColor: bgColor || colors.primaryColor,
        marginVertical,
        ...shadow,
      }, styles.button]}
    >
      <Text
        style={[{
          fontSize: titleSize,
          color: titleColor || colors.buttonText,
          fontFamily: fontFamily || fonts.semiBold,
        },
        styles.buttonText,
        ]}
      >
        {title}
      </Text>
    </Button>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    letterSpacing: -0.1,
    fontFamily: fonts.avenirBold,
  },
  button: { justifyContent: 'center' },
})
