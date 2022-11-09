import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { MainHeader } from 'app/components/Headers'
import { useFocusState } from 'react-navigation-hooks'
import SafeAreaView from 'react-native-safe-area-view'
// import { Input, XButton, FullWidthButton, PillButton } from 'app/components'
import { colors, containers, fonts, screenWidth } from 'app/styles'
import { PRODUCTS } from 'app/lib/constants'

export default function Shop({ navigation }) {
  const [, dispatch] = getState()
  const { isFocused } = useFocusState()

  const onSaleProducts = () => PRODUCTS
    .filter((p) => p.onSale)
    .sort((a, b) => a.id - b.id)

  const storeProducts = () => PRODUCTS.sort((a, b) => b.id - a.id)

  useEffect(() => {
    if (!isFocused) return
    dispatch({ type: 'clearTransfer' })
  }, [isFocused])

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <MainHeader navigation={navigation} />
      <ScrollView
        style={containers.screenContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>HOT DEALS</Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate={0}
          snapToInterval={150}
          horizontal
          style={{ height: 200, marginVertical: 10 }}
          contentOffset={{ x: -20, y: 0 }}
          contentInset={{
            top: 0,
            left: 20,
            bottom: 0,
            right: 20,
          }}
        >
          {onSaleProducts().map((item) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Product', { product: item })}
              style={{ key: item.id, width: 150, height: 200, alignItems: 'center' }}
            >
              <View style={{ height: '60%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={item.imageUrl} style={{ height: 110, width: 110 }} />
              </View>
              <View style={{ alignSelf: 'flex-start', width: '80%', height: '40%' }}>
                <Text numberOfLines={2}>{item.name}</Text>
                <Text>{`${item.rating} ★`}</Text>
                <Text>{`$ ${item.amountFacevalue}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>STORE</Text>
        </View>
        {storeProducts().map((item) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Product', { product: item })}
            style={{ key: item.id, height: 150, width: screenWidth, flexDirection: 'row', borderBottomColor: colors.lightText, borderBottomWidth: 1 }}
          >
            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={item.imageUrl} style={{ height: 110, width: 110 }} />
            </View>
            <View style={{ justifyContent: 'center', width: '50%', paddingRight: 8 }}>
              <Text numberOfLines={2}>{item.name}</Text>
              <Text>{`${item.rating} ★`}</Text>
              <Text>{`$ ${item.amountFacevalue}`}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  userInfoContainer: {
    left: 17,
    justifyContent: 'flex-end',
  },
  promotions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  userInfoText: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
})
