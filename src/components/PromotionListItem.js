import React, { useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, fonts, screenWidth } from 'app/styles'

export default function PromotionListItem({
  imageUrl,
  onPress,
}) {
  const [style, setStyle] = useState({
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    backgroundColor: 'transparent',
  })

  const addShadows = () => {
    setStyle({
      ...style,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    })
  }
  return (
    <TouchableOpacity activeOpacity={0.7} style={{ width: screenWidth }} onPress={() => onPress()}>
      <View style={style}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
          onLoadEnd={addShadows}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    width: screenWidth * 0.95,
    height: screenWidth * 0.633,
    borderRadius: 10,
  },
  name: {
    fontFamily: fonts.semiBold,
    color: colors.buttonText,
    opacity: 0.9,
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.bold,
    color: colors.buttonText,
    fontSize: 15,
    width: screenWidth * 0.7,
    textAlign: 'center',
  },
})
