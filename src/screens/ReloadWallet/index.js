import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SubHeader } from 'app/components/Headers'
import SafeAreaView from 'react-native-safe-area-view'
import { Icon } from 'react-native-elements'
import { colors, fonts, containers, percentWidth } from 'app/styles'

export default function ReloadWallet({ navigation }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Reload Wallet" navigation={navigation} />
      <View style={containers.screenContainer}>
        <ScrollView style={{ flex: 1, marginTop: percentWidth(2) }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CashReload')}
            style={styles.section}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="cash"
                type="material-community"
                color={colors.primaryColor}
                size={30}
                containerStyle={{ marginTop: -10 }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Cash</Text>
              <Text numberOfLines={3} style={styles.sectionText}>Reload your wallet at local merchants.</Text>
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
            onPress={() => navigation.navigate('CreditCardAmount')}
            style={styles.section}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="credit-card"
                type="material-community"
                color={colors.primaryColor}
                size={30}
                containerStyle={{ marginTop: -10 }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Debit Card</Text>
              <Text numberOfLines={3} style={styles.sectionText}>Instantly reload your wallet with a debit card.</Text>
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
            onPress={() => navigation.navigate('AddBank')}
            style={styles.section}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="bank"
                type="material-community"
                color={colors.primaryColor}
                size={30}
                containerStyle={{ marginTop: -10 }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Bank Transfer</Text>
              <Text numberOfLines={3} style={styles.sectionText}>Instantly reload your wallet with a bank transfer.</Text>
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
            onPress={() => navigation.navigate('CryptoAmount')}
            style={styles.section}
          >
            <View style={styles.iconContainer}>
              <Icon
                name="bitcoin"
                type="material-community"
                color={colors.primaryColor}
                size={30}
                containerStyle={{ marginTop: -10 }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.sectionTitle}>Cryptocurrency</Text>
              <Text numberOfLines={3} style={styles.sectionText}>Instantly reload your wallet with your favorite cryptocurrency.</Text>
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
      </View>
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
  textContainer: { width: '60%' },
})
