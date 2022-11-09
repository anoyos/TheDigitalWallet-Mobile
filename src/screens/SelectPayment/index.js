import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { PillButton, CreditCardListItem } from 'app/components'
import { containers, percentWidth, fonts, percentHeight, colors } from 'app/styles'

export default function SelectPayment({ navigation }) {
  const [{ user }] = getState()
  const [selectedSource, setSelectedSource] = useState('')
  const total = navigation.getParam('total')

  const handleSelectPayment = (id) => {
    setTimeout(() => setSelectedSource(id), 150)
  }

  const handleContinue = async () => {
    navigation.navigate('Bill', { total, selectedSource })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <SubHeader navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={containers.screenContainer}
      >
        <View style={{ backgroundColor: 'whitesmoke', paddingVertical: percentWidth(8), marginTop: percentWidth(15) }}>
          <Text style={{ marginLeft: percentWidth(7), fontSize: percentWidth(5), fontFamily: fonts.bold }}>Choose your way to pay</Text>
          <View style={{ marginTop: percentWidth(6) }}>
            {/* {user.tokenSources.map((source) => <CreditCardListItem source={source} activeId={selectedSource} onPress={() => handleSelectPayment(source.id)} />)} */}
            {user.sources.map((source) => <CreditCardListItem source={source} activeId={selectedSource} onPress={() => handleSelectPayment(source.id)} />)}
          </View>
          <View style={{ width: percentWidth(55), marginLeft: percentWidth(7) }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', height: percentWidth(15) }}
              onPress={() => { navigation.navigate('AddPaymentMethod') }}
            >
              <Text style={{ fontSize: percentWidth(8), color: '#2D337C', height: percentWidth(10), paddingLeft: percentWidth(4) }}>+</Text>
              <View style={{ flexDirection: 'column', alignItems: 'center', height: percentWidth(10), paddingLeft: percentWidth(3), paddingTop: percentWidth(1.3), justifyContent: 'center' }}>
                <Text style={{ fontSize: percentWidth(4), color: '#2D337C' }}>Add Payment Method</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: percentWidth(7) }}>
          {user.sources.length > 0 && (
          <PillButton
            onPress={handleContinue}
            height={percentWidth(12)}
            width={percentWidth(70)}
            title="Continue"
            bgColor={colors.secondaryColor}
            titleSize={percentWidth(4.3)}
          />
          )}
        </View>
        <View style={{ height: percentHeight(20) }} />
      </ScrollView>
    </View>
  )
}
