import React from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Icon } from 'react-native-elements'
import { colors, fonts, percentWidth, shadow } from 'app/styles'

export default function PlacesInput({
  value,
  placeholder,
  clearText,
  editable,
  showAddress,
  borderWidth,
  width,
  borderRadius,
  height,
  dropShadow,
  backgroundColor,
}) {
  return (
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
        // // paddingLeft: percentWidth(5),
        // paddingRight: percentWidth(20),
        paddingTop: percentWidth(2),
        paddingBottom: percentWidth(2),
      }, dropShadow ? shadow : {}]}
    >
      <View style={{ flexDirection: 'row', paddingRight: percentWidth(2) }}>
        <TouchableOpacity style={{ justifyContent: 'center', width: '90%' }} onPress={showAddress}>
          <View pointerEvents="none">
            <TextInput
              editable={editable}
              autoCorrect={false}
              underlineColorAndroid="rgba(0,0,0,0)"
              placeholderTextColor={colors.lightText}
              placeholder={placeholder}
              value={value}
              style={{ ...styles.textContainer, ...styles.text }}
              collapsable={false}
            />
          </View>
        </TouchableOpacity>
        {
            !!value && (
              <TouchableOpacity style={{ justifyContent: 'center', flexGrow: 1, alignItems: 'flex-end' }} onPress={clearText}>
                <Icon
                  name="times-circle"
                  type="font-awesome"
                  size={18}
                  iconStyle={{ marginRight: 10 }}
                  color={colors.text}
                />
              </TouchableOpacity>
            )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 4,
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    height: 41.2,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingLeft: percentWidth(5),
  },
  text: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
    marginVertical: 5,
    width: '96%',
  },
})
