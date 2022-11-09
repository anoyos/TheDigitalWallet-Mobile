import React from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { colors, fonts, percentWidth, percentHeight, shadow } from 'app/styles'
import { Modalize } from 'react-native-modalize'
import { TextInput } from 'react-native-gesture-handler'
import { COUNTRY_CODES } from 'app/lib/constants'
import Flag from 'react-native-flags'

const CountryCodeItem = ({ countryCode, setCountryCode, closeModal, updateAyt }) => (
  <TouchableOpacity
    key={countryCode.code}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.1)',
    }}
    onPress={() => {
      updateAyt(countryCode.code)
      setCountryCode(countryCode)
      closeModal()
    }}
  >
    <View style={{ width: percentWidth(33.33), justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: fonts.regular, fontSize: percentWidth(4.7) }}>
        {`${countryCode.code}`}
      </Text>
    </View>
    <View style={{ width: percentWidth(33.33), justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: fonts.regular, fontSize: percentWidth(4.7) }}>{`${countryCode.dial_code}`}</Text>
    </View>
    <View style={{ width: percentWidth(33.33), justifyContent: 'center', alignItems: 'center' }}>
      <Flag
        code={countryCode.code}
        size={64}
      />
    </View>
  </TouchableOpacity>
)

export default function CountryCodeSelectModal({
  closeModal,
  modalRef,
  setCountryCode,
  countryCodeSearchText,
  setCountryCodeSearchText,
  updateAyt,
}) {
  const search = () => COUNTRY_CODES.filter(
    (c) => (
      c.name.toLowerCase().search(countryCodeSearchText.toLowerCase()) >= 0
    ) || (
      countryCodeSearchText.toLowerCase().slice(0, 2) === c.code.toLowerCase()
    ),
  )

  return (
    <Modalize
      ref={modalRef}
      modalStyle={{
        width: percentWidth(100),
        margin: 0,
        backgroundColor: 'white',
      }}
      snapPoint={percentHeight(70)}
      scrollViewProps={{
        bounces: false,
      }}
    >
      <View style={{
        height: percentHeight(8),
        backgroundColor: colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: percentWidth(3),
        borderTopRightRadius: percentWidth(3),
      }}
      >
        <TextInput
          placeholder="Search by country name or abbreviation"
          placeholderTextColor={colors.lightText}
          onChangeText={(value) => setCountryCodeSearchText(value)}
          value={countryCodeSearchText}
          fetchDetails
          returnKeyType="search"
          style={{
            backgroundColor: 'white',
            color: colors.text,
            fontFamily: fonts.semiBold,
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: percentWidth(4),
            bottom: percentWidth(0.8),
            height: '60%',
            width: '95%',
            borderRadius: 5,
            paddingTop: 4.5,
            paddingBottom: 4.5,
            paddingLeft: 10,
            paddingRight: 10,
            marginTop: 7.5,
            marginLeft: 8,
            marginRight: 8,
            ...shadow,
          }}
        />
      </View>
      <FlatList
        data={search()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <CountryCodeItem updateAyt={updateAyt} countryCode={item} setCountryCode={setCountryCode} closeModal={closeModal} />}
      />
    </Modalize>
  )
}
