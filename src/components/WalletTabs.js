import React from 'react'
import { View } from 'react-native'
import { colors } from 'app/styles'

export default function WalletTabViews({ listSelection }) {
  // if (listSelection === 0) {
  //   return (
  //     <View style={{ height: 2, flexDirection: 'row' }}>
  //       <View style={{ width: '33.33%', backgroundColor: colors.activeTab }} />
  //       <View style={{ width: '33.33%', height: '40%', backgroundColor: colors.inactiveTab }} />
  //       <View style={{ width: '33.33%', height: '40%', backgroundColor: colors.inactiveTab }} />
  //     </View>
  //   )
  // }
  if (listSelection === 1) {
    return (
      <View style={{ height: 2, flexDirection: 'row' }}>
        <View style={{ width: '50%', backgroundColor: colors.activeTab }} />
        <View style={{ width: '50%', height: '40%', backgroundColor: colors.inactiveTab }} />
      </View>
    )
  }
  return (
    <View style={{ height: 2, flexDirection: 'row' }}>
      <View style={{ width: '50%', height: '40%', backgroundColor: colors.inactiveTab }} />
      <View style={{ width: '50%', backgroundColor: colors.activeTab }} />
    </View>
  )
}
