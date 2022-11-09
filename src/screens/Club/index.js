import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { useFocusState } from 'react-navigation-hooks'
import SafeAreaView from 'react-native-safe-area-view'
import { ClubHeader, SubHeader } from 'app/components/Headers'
// import { Input, XButton, FullWidthButton, PillButton } from 'app/components'
import { colors, containers, fonts, screenWidth, percentWidth } from 'app/styles'
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
      {navigation.state.routeName === 'Club' ? <ClubHeader navigation={navigation} /> : <SubHeader navigation={navigation} title="Browse" />}
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
              key={item.id}
              onPress={() => navigation.navigate('Product', { product: item })}
              style={{ width: 150, height: 200, alignItems: 'center', marginRight: 3 }}
            >
              <View style={{ height: '60%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={item.imageUrl} style={{ height: 160, width: 160, right: 8 }} />
              </View>
              <View style={{ alignSelf: 'flex-start', width: '80%', height: '40%' }}>
                <Text numberOfLines={2}>{item.name}</Text>
                <Text>{item.level}</Text>
                <Text>{`$ ${item.amountFacevalue}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>OFFERS</Text>
        </View>
        {storeProducts().map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate('Product', { product: item })}
            style={{ height: 150, width: screenWidth, flexDirection: 'row', borderBottomColor: colors.lightText, borderBottomWidth: 1 }}
          >
            <View style={{ width: '45%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={item.imageUrl} style={{ height: 160, width: 160 }} />
            </View>
            <View style={{ justifyContent: 'center', width: '55%', paddingRight: 8 }}>
              <Text numberOfLines={2}>{item.name}</Text>
              <Text>{item.level}</Text>
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
    paddingTop: percentWidth(5),
    paddingBottom: percentWidth(4),
    justifyContent: 'flex-end',
  },
  userInfoText: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: percentWidth(4.7),
  },
  promotions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
})
