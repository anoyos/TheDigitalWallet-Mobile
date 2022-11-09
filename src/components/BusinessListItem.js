import React from 'react'
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, Platform } from 'react-native'
import { Icon } from 'react-native-elements'
import { XButton } from 'app/components'
import { getState } from 'app/lib/react-simply'
import NavigationService from 'app/lib/NavigationService'
import { colors, fonts, screenWidth } from 'app/styles'
// import * as api from 'app/lib/api'

export default function BusinessListItem({
  business,
  business: {
    name,
    description,
    latitude,
    longitude,
    imageUrl,
    phone,
    websiteUrl,
    id,
  },
  closeCallout,
  style,
  xButton,
}) {
  const [{ promotions }] = getState()
  const data = promotions.filter((x) => x.businessId === id)

  const handlePhonePress = () => Linking.openURL(`tel:${phone}`)

  const goToBusiness = () => NavigationService.navigate('Business', { selectedBusiness: business })

  const handleURLPress = () => {
    // if (!websiteUrl.startsWith('http')) {
    //   const newUrl = `http://${websiteUrl}`
    //   Linking.openURL(newUrl)
    // } else {
    Linking.openURL('https://www.loladenver.com/')
    // }
  }

  const handleAddressPress = () => {
    const link = Platform.OS === 'android'
      ? `http://maps.google.com/maps?q=${latitude},${longitude}&z=15`
      : `maps://app?daddr=${latitude}+${longitude}`
    Linking.openURL(link)
  }
  return (
    <View style={[style, styles.container]}>
      {!!xButton && <XButton onPress={closeCallout} top="5.5%" />}
      <View style={{ width: '35%', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={{ uri: imageUrl }} style={styles.businessImage} />
      </View>
      <View style={{ flexGrow: 1 }}>
        <Text numberOfLines={1} style={styles.titleText}>{ name }</Text>
        <Text numberOfLines={1} style={styles.descriptionText}>
          {description}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleAddressPress()}>
            <Icon
              name="directions"
              type="material"
              color={colors.text}
              size={32}
            />
          </TouchableOpacity>
          {
              !!phone && (
                <TouchableOpacity onPress={() => handlePhonePress()}>
                  <Icon
                    name="phone"
                    type="font-awesome"
                    color={colors.text}
                    size={25}
                  />
                </TouchableOpacity>
              )
          }
          {
              !websiteUrl && (
                <TouchableOpacity onPress={() => handleURLPress()}>
                  <Icon
                    name="link"
                    type="feather"
                    color={colors.text}
                    size={25}
                  />
                </TouchableOpacity>
              )
          }
          {
              !!(data.length > 0) && (
                <TouchableOpacity onPress={goToBusiness}>
                  <Icon
                    name="bullhorn"
                    type="font-awesome"
                    color={colors.text}
                    size={25}
                  />
                </TouchableOpacity>
              )
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    height: screenWidth * 0.3048780488,
    width: screenWidth * 0.8,
    borderWidth: 2,
    borderColor: '#363466',
    borderRadius: 8,
    backgroundColor: colors.bgColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 1,
    alignSelf: 'center',
  },
  businessImage: {
    height: 90 * 0.5889328063,
    width: 90,
    borderColor: '#363466',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingBottom: 7,
    marginLeft: -10,
  },
  titleText: {
    height: 38,
    width: 144,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    letterSpacing: -0.4,
    paddingTop: 12,
  },
  descriptionText: {
    width: 192,
    color: colors.lightText,
    fontFamily: fonts.regular,
    fontSize: 12,
    letterSpacing: -0.35,
  },
})
