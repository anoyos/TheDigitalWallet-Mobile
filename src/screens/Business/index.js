import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { colors, containers, fonts, screenWidth } from 'app/styles'
import { PRODUCTS } from 'app/lib/constants'

export default function Business({ navigation }) {
  const { selectedBusiness } = navigation.state.params
  const storeProducts = () => PRODUCTS.sort((a, b) => a.id < b.id)

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title={`${selectedBusiness.name}`} navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedBusiness.imageUrl }} style={{ width: 300, height: 200, borderRadius: 10 }} />
        </View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>ITEMS FOR SALE</Text>
        </View>
        {storeProducts().map((item) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Product', { ...item })}
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitleContainer: {
    left: 17,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  inputContainer: { paddingBottom: 10 },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 200,
    marginBottom: 35,
    alignSelf: 'center',
    borderRadius: 10,
  },
  userInfoContainer: {
    left: 17,
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
})
