import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { useFocusState } from 'react-navigation-hooks'
import { colors, text, containers } from 'app/styles'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import CreditCards from './CreditCards'

export default function SelectCreditCard({ navigation }) {
  const [loading, setLoading] = useState(true)
  const { isFocused } = useFocusState()
  const [, dispatch] = getState()

  useEffect(() => {
    if (!isFocused) return
    api.getSources()
      .then(({ sources: { data } }) => {
        const payload = { sources: data }
        dispatch({ type: 'setUser', payload })
      })
      .then(() => setLoading(false))
      .catch((error) => toast.error(error))
  }, [isFocused])

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Select a Card" navigation={navigation} />
      <View style={containers.screenContainer}>
        {
          loading
            ? (
              <View style={{ height: 275, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={colors.skyBlue} size="large" />
                <Text style={text.loading}>Fetching Cards</Text>
              </View>
            ) : <CreditCards navigation={navigation} />
        }
      </View>
    </SafeAreaView>
  )
}
