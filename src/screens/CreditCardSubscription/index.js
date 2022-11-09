import React from 'react'
import { View, FlatList } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { SubHeader } from 'app/components/Headers'
import { PlanListItem } from 'app/components'
import { containers, colors } from 'app/styles'

export default function CreditCardSubscription({ navigation }) {
  const [{ plans, user: { sources } }, dispatch] = getState()

  const handleOnPress = (plan) => {
    const payload = { plan }
    dispatch({ type: 'setPurchase', payload })
    if (sources.length === 0) navigation.navigate('AddCreditCard')
    else navigation.navigate('ConfirmCCPurchase')
  }

  const shownPlans = () => {
    const sorted = plans
      .sort((a, b) => a.amount - b.amount)
    return sorted
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgColor }}>
      <SubHeader title="Choose Subsription" navigation={navigation} />
      <View style={containers.screenContainer}>
        <FlatList
          data={shownPlans()}
          renderItem={({ item }) => (
            <PlanListItem
              {...item}
              onPress={() => handleOnPress(item)}
            />
          )}
          keyExtractor={item => `plan-${item.id}`}
        />
      </View>
    </View>
  )
}
