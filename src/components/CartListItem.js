import React from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, screenWidth, fonts } from 'app/styles'
import { getState } from 'app/lib/react-simply'

export default function CartListItem({ index }) {
  const [{ cart }, dispatch] = getState()
  const product = cart[index]
  const total = product.amountFacevalue * product.quantity

  return (
    <View
      style={{
        height: 100,
        flexDirection: 'row',
        borderBottomColor: colors.arrowBorder,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          width: screenWidth * 0.22,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            height: screenWidth * 0.18,
            width: screenWidth * 0.18,
          }}
          source={product.imageUrl}
        />
      </View>
      <View
        style={{
          width: screenWidth * 0.4,
          justifyContent: 'center',
          paddingLeft: 3,
        }}
      >
        <Text numberOfLines={1} style={styles.sectionTitle}>{product.name}</Text>
        <Text numberOfLines={4} style={styles.sectionText}>{product.level}</Text>
      </View>
      <View
        style={{
          width: screenWidth * 0.18,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              if (product.quantity > 1) dispatch({ type: 'decreaseQuantity', payload: { index } })
            }}
            style={{
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.arrowBackground,
            }}
          >
            <Text>{product.quantity}</Text>
          </View>
          <TouchableOpacity
            onPress={() => dispatch({ type: 'increaseQuantity', payload: { index } })}
            style={{
              height: 20,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: screenWidth * 0.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.amount}>{`$${Math.round(total * 100) / 100}`}</Text>
        <TouchableOpacity
          onPress={() => dispatch({ type: 'deleteFromCart', payload: { id: product.id } })}
        >
          <Text style={styles.amount}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  amount: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  sectionText: {
    color: colors.lightText,
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingTop: 5,
  },
})
