import React from 'react'
import { View, ScrollView } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import { containers } from 'app/styles'
import SafeAreaView from 'react-native-safe-area-view'

export default function Marketplace({ navigation }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader navigation={navigation} title="Marketplace" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={containers.screenContainer}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

// const styles = StyleSheet.create({
// })
