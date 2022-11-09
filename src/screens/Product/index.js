import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { ShoppingHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import { getState } from 'app/lib/react-simply'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { colors, fonts, screenWidth, percentHeight } from 'app/styles'

export default function Product({ navigation }) {
  const [quantity, setQuantity] = useState(1)
  const [{ businesses }, dispatch] = getState()
  const { product } = navigation.state.params
  const business = businesses.filter(b => b.id === product.businessId)[0] || false

  const handleAddToCart = () => {
    product.quantity = quantity
    dispatch({ type: 'addToCart', payload: product })
    navigation.navigate('Club')
  }

  const handleBuyNow = () => {
    const payload = {
      amount: product.amountFacevalue * quantity,
      toAddress: 'address',
      name: 'Digitall',
      type: 'purchase',
    }
    dispatch({ type: 'setTransfer', payload })
    navigation.navigate('ConfirmTransfer')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <ShoppingHeader title="Item" navigation={navigation} />
      <KeyboardAwareScrollView
        extraScrollHeight={10}
        contentContainerStyle={{ flexGrow: 1, paddingTop: percentHeight(15), paddingHorizontal: screenWidth * 0.03 }}
        enableOnAndroid
      >
        <View style={{ flexDirection: 'row', width: screenWidth }}>
          <View style={{ width: '65%' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Business', { selectedBusiness: business })}
              disabled
            >
              <Text numberOfLines={1} style={styles.rating}>Digitall</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: screenWidth * 0.9 }}>
          <Text style={styles.name}>{`${product.name} - ${product.level}`}</Text>
        </View>
        <View style={{ height: 230, width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={product.imageUrl} style={{ height: screenWidth * 0.65, width: screenWidth * 0.65 }} />
        </View>
        <View>
          <Text style={styles.price}>{`Price: $ ${product.amountFacevalue}`}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.quantity}>Quantity: </Text>
            <TouchableOpacity
              onPress={() => {
                if (quantity > 1) setQuantity(quantity - 1)
              }}
              style={{
                height: 20,
                width: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.quantity}>-</Text>
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
              <Text style={styles.quantity}>{quantity}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (quantity > 19) setQuantity(20)
                else setQuantity(quantity + 1)
              }}
              style={{
                height: 20,
                width: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.quantity}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: screenWidth, alignItems: 'center', marginTop: 20 }}>
          <PillButton
            title="Buy Now"
            width={200}
            onPress={handleBuyNow}
          />
          <PillButton
            title="Add to Cart"
            width={200}
            onPress={handleAddToCart}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  businessName: {
    fontFamily: fonts.regular,
    color: '#0000EE',
    fontSize: 14,
  },
  rating: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 16,
  },
  reviews: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 14,
  },
  name: {
    fontFamily: fonts.regular,
    color: '#282828',
    fontSize: 14,
  },
  price: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 14,
  },
  quantity: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 14,
  },
})
