import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { XButton } from 'app/components'
import { colors, containers, text, fonts, percentWidth } from 'app/styles'

export default function AddressSelect({ handleClose, address, setAddress, setFormattedAddress }) {
  const [showPlacesList, setShowPlacesList] = useState(false)

  const handleSelectAddress = (selectedAddress, details) => {
    setAddress(selectedAddress)
    setFormattedAddress(details)
    setTimeout(() => handleClose(false), 100)
  }

  return (
    <View style={{ flex: 1 }}>
      <XButton onPress={() => handleClose(false)} />
      <View style={containers.screenTitleContainer}>
        <Text style={text.screenTitleText}>Select Address</Text>
      </View>
      <GooglePlacesAutocomplete
        text={address}
        placeholder="Business address"
        placeholderTextColor={colors.lightText}
        minLength={2}
        autoFocus
        returnKeyType="search"
        listViewDisplayed={showPlacesList}
        fetchDetails
        textInputProps={{
          onFocus: () => setShowPlacesList(true),
          onBlur: () => setShowPlacesList(true),
        }}
        onPress={(data, details) => handleSelectAddress(data.description, details)}
        getDefaultValue={() => ''}
        query={{
          key: 'AIzaSyA2oyLGIxTOgsciEPfy4urTm915FT-bdQs',
          language: 'en',
          types: 'address',
        }}
        styles={{
          textInputContainer: {
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: percentWidth(3),
            height: percentWidth(12),
            width: percentWidth(85),
            alignSelf: 'center',
            backgroundColor: 'white',
            paddingTop: percentWidth(2),
            paddingBottom: percentWidth(2),
            marginBottom: percentWidth(5),
          },
          textInput: {
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: 14,
            bottom: percentWidth(1.5),
            borderBottomWidth: 0,
            paddingLeft: percentWidth(4),
          },
          poweredContainer: {
            height: 30,
            alignItems: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0)',
          },
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        GooglePlacesSearchQuery={{ rankby: 'distance' }}
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: ['formatted_address', 'geometry'],
        }}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        renderRow={(item) => (
          <View>
            <Text style={{ color: colors.text, fontFamily: fonts.regular }}>
              {item.description}
            </Text>
          </View>
        )}
        debounce={200}
      />
    </View>
  )
}
