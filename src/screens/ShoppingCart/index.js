import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { colors, screenWidth, fonts, containers } from 'app/styles'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { CartListItem, FullWidthButton } from 'app/components'
import { getState } from 'app/lib/react-simply'

export default function Cards({ navigation }) {
  const [{ cart }, dispatch] = getState()
  const total = cart.length > 0 ? cart.map((x) => x.amountFacevalue * x.quantity).reduce((x, y) => x + y) : 0

  const handleCheckout = () => {
    const payload = { amount: total, toAddress: 'address', name: 'Balehu', type: 'purchase' }
    dispatch({ type: 'setTransfer', payload })
    navigation.navigate('SelectPayment', { total })
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Shopping Cart" navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        {cart.map((item, index) => (
          <CartListItem key={item.id} index={index} />
        ))}
        <View
          style={{
            height: 170,
            flexDirection: 'row',
            borderBottomColor: colors.arrowBorder,
            borderBottomWidth: 1,
          }}
        >
          <View style={{ width: screenWidth * 0.5, justifyContent: 'space-evenly', paddingHorizontal: 20 }}>
            <Text style={styles.amount}>{`Items (${cart.length}):`}</Text>
            <Text style={styles.amount}>Shipping:</Text>
            <Text style={styles.amount}>Taxes:</Text>
            <Text style={styles.amount}>Order Total:</Text>
          </View>
          <View style={{ width: screenWidth * 0.5, justifyContent: 'space-evenly', paddingHorizontal: 20, alignItems: 'flex-end' }}>
            <Text style={styles.amount}>{`$${Math.round(total * 100) / 100}`}</Text>
            <Text style={styles.amount}>$0</Text>
            <Text style={styles.amount}>$0</Text>
            <Text style={styles.amount}>{`$${Math.round(total * 100) / 100}`}</Text>
          </View>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
      <View>
        <FullWidthButton
          title="Checkout"
          condition={cart.length < 1}
          onPress={handleCheckout}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  amount: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
})
