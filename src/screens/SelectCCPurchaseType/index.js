import React, { useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { Icon } from 'react-native-elements'
import { colors, containers, fonts } from 'app/styles'
import * as api from 'app/lib/api'

export default function SelectCCPurchaseType({ navigation }) {
  const [{ user: { sources } }, dispatch] = getState()

  const handleOnPress = (screen, type) => {
    const payload = sources ? { type, source: sources[0] } : { type }
    dispatch({ type: 'setPurchase', payload })
    navigation.navigate(screen)
  }

  useEffect(() => {
    api.getPlans()
      .then(({ plans: { data: payload } }) => dispatch({ type: 'setPlans', payload }))
      .catch((err) => console.log(err)) // eslint-disable-line no-console
  }, [])

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Choose Method" navigation={navigation} />
      <ScrollView style={containers.screenContainer}>
        <TouchableOpacity
          onPress={() => handleOnPress('CreditCardSubscription', 'subscription')}
          style={styles.section}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="repeat"
              type="material-community"
              color={colors.primaryColor}
              size={30}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Subscribe</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{ marginTop: -10 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOnPress('CreditCardAmount', 'one_time_purchase')}
          style={[styles.section, { marginTop: 10 }]}
        >
          <View style={styles.iconContainer}>
            <Icon
              name="credit-card"
              type="material-community"
              color={colors.primaryColor}
              size={30}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Buy Now</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              type="material-community"
              color={colors.lightText}
              size={22}
              containerStyle={{ marginTop: -10 }}
            />
          </View>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  sectionText: {
    color: colors.lightText,
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingTop: 10,
  },
  iconContainer: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '60%',
    justifyContent: 'center',
  },
})
