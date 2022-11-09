import React from 'react'
import { View, TextInput, Text } from 'react-native'
import { colors, fonts, percentWidth, shadow } from 'app/styles'

export default function Input({
  fontSize,
  keyboardType,
  ref,
  value,
  placeholder,
  numberOfLines,
  multiline,
  blurOnSubmit,
  onChangeText,
  onBlur,
  secureTextEntry,
  editable,
  textContentType,
  returnKeyType,
  width,
  height,
  onKeyPress,
  autoCorrect,
  autoCapitalize,
  borderRadius,
  dropShadow,
  backgroundColor,
  borderWidth,
  label,
  labelStyle,
  maxLength,
  onFocus,
}) {
  return (
    <>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View
        style={[{
          marginVertical: 4,
          borderColor: colors.inputBorder,
          borderWidth: borderWidth ?? 1,
          borderRadius: (borderRadius) ? percentWidth(borderRadius) : 0,
          height: height ? percentWidth(height) : percentWidth(11),
          width: width ? percentWidth(width) : percentWidth(70),
          alignSelf: 'center',
          backgroundColor: backgroundColor ?? 'white',
          paddingLeft: percentWidth(5),
          paddingRight: percentWidth(5),
        }, dropShadow ? shadow : {}]}
      >
        <TextInput
          ref={ref}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          autoCorrect={autoCorrect}
          onKeyPress={onKeyPress}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholderTextColor={colors.lightText}
          placeholder={placeholder}
          numberOfLines={numberOfLines}
          multiline={multiline}
          blurOnSubmit={blurOnSubmit}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          editable={editable}
          width={width}
          style={{
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'center',
            borderBottomWidth: 0,
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: fontSize ?? percentWidth(4.1),
            width: '100%',
          }}
          textContentType={textContentType}
          collapsable={false}
          height={height}
          onBlur={onBlur}
          maxLength={maxLength}
          onFocus={onFocus}
        />
      </View>
    </>
  )
}
