import React, { useState } from 'react'
import { View, ScrollView, Image, Text } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { PillButton } from 'app/components'
import { Button } from 'react-native-material-buttons'
import { getState } from 'app/lib/react-simply'
import { PAIRS } from 'app/lib/constants'
import { percentWidth, percentHeight, containers, fonts, colors } from 'app/styles'

const Item = ({ state, setter, symbol, image, character, name, currentDefault }) => {
  if (symbol === currentDefault) {
    return (
      <Button
        disabled
        style={{
          flexDirection: 'row',
          width: percentWidth(75),
          height: percentWidth(10),
          alignSelf: 'center',
          marginVertical: percentWidth(1),
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      >
        <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={image} style={{ width: percentWidth(8), height: percentWidth(8) }} />
        </View>
        <View style={{ width: '46.66%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: percentWidth(3.2), fontFamily: fonts.semiBold, color: colors.text }}>{name}</Text>
          <Text style={{ fontSize: percentWidth(3.2), fontFamily: fonts.semiBold, color: colors.text }}>Current Default</Text>
        </View>
        <View style={{ width: '33.33%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text }}>{character ? `${symbol} (${character})` : `${symbol}`}</Text>
        </View>
      </Button>
    )
  }
  return (
    <Button
      onPress={() => setter(symbol)}
      shadeBorderRadius={10}
      disabled={state === symbol}
      color="white"
      style={{
        flexDirection: 'row',
        width: percentWidth(75),
        height: percentWidth(10),
        alignSelf: 'center',
        marginVertical: percentWidth(1),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
      }}
    >
      <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={image} style={{ width: percentWidth(8), height: percentWidth(8) }} />
      </View>
      <View style={{ width: '46.66%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text }}>{name}</Text>
      </View>
      <View style={{ width: '33.33%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.semiBold, color: colors.text }}>{character ? `${symbol} (${character})` : `${symbol}`}</Text>
      </View>
    </Button>
  )
}

export default function DefaultCurrency({ navigation }) {
  const [symbol, setSymbol] = useState('')
  const [{ user }, dispatch] = getState()

  const handleSetCurrency = () => {
    dispatch({ type: 'setUserCurrency', payload: { symbol } })
    navigation.navigate('Wallets')
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Default Currency" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ height: percentHeight(60), marginTop: percentHeight(5) }}>
          <ScrollView>
            {
              PAIRS.map((pair) => (
                <Item
                  key={`currency-${pair.id}`}
                  image={pair.image}
                  character={pair.character}
                  setter={setSymbol}
                  symbol={pair.symbol}
                  state={symbol}
                  name={pair.name}
                  currentDefault={user.currency.symbol}
                />
              ))
            }
            <View style={{ height: percentHeight(2) }} />
          </ScrollView>
        </View>
        <View style={{ height: percentHeight(20), justifyContent: 'center', alignItems: 'center' }}>
          <PillButton
            gradient
            onPress={handleSetCurrency}
            height={percentWidth(10)}
            width={percentWidth(50)}
            title="Set Currency"
            condition={!symbol}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
