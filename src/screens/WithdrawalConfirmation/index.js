import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { FullWidthButton, CompletedModal, ConfirmationListItem } from 'app/components'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import Ethereum from 'app/lib/eth'
import { PAIRS } from 'app/lib/constants'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { localize } from 'app/lib/currency'
import { percentWidth, percentHeight, screenHeight, colors, fonts, containers } from 'app/styles'

export default function WithdrawalConfirmation({ navigation }) {
  const [{ user, currencies }] = getState()
  const [exchangeRate, setExchangeRate] = useState('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const amount = navigation.getParam('amount', '')
  const bankAccount = navigation.getParam('bankAccount', '')
  const symbol = navigation.getParam('symbol', '')
  const [symbolImage, setSymbolImage] = useState({})

  useEffect(() => {
    if (symbol) {
      const { image } = PAIRS.filter((pair) => pair.symbol === symbol)[0]
      setSymbolImage(image)
    }
    if (user.currency.symbol !== symbol) {
      api.getExchangeRate({ from: symbol, to: user.currency.symbol })
        .then((response) => setExchangeRate(response.rate))
        .catch(() => setExchangeRate(''))
    }
  }, [symbol])

  const handleConfirmationPress = async () => {
    setLoading(true)
    try {
      const eth = await Ethereum.create(user)
      await eth.cashOut(amount, symbol)
      await api.withdrawFromDigitall({
        bank_info_id: bankAccount.id,
        amount,
        symbol,
      })
      setLoading(false)
      setCompleted(true)
    } catch (err) {
      setLoading(false)
      toast.error(err)
    }
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Confirm Withdrawal" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: percentHeight(23) }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.amount}>{amount}</Text>
            <Text style={styles.character}>{` ${currencies[symbol].displaySymbol}`}</Text>
          </View>
        </View>
        <View>
          <ConfirmationListItem
            title="Wallet"
            symbol={symbol}
            symbolImage={symbolImage}
          />
          <ConfirmationListItem
            title="Bank account number"
            value={bankAccount ? `**** ${bankAccount.accountNumber.slice(-4)}` : ''}
          />
          <ConfirmationListItem
            title="Amount"
            value={`${localize(amount, user.locales, currencies[symbol].decimals)} ${symbol}`}
          />
          <ConfirmationListItem
            title="Total"
            value={`${localize(amount, user.locales, currencies[symbol].decimals)} ${symbol}`}
            total
          />
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <FullWidthButton
            onPress={() => handleConfirmationPress()}
            title="Confirm Withdrawal"
            condition={loading || completed}
            loading={loading}
          />
        </View>
      </View>
      <CompletedModal
        completed={completed}
        completedMessage="You're withdrawal has been successfully recieved!"
        handleClosePress={() => {
          setCompleted(false)
          navigation.popToTop()
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: percentHeight(30),
    marginBottom: 10,
  },
  baseContainer: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: screenHeight * 0.09,
    marginBottom: 10,
    flexDirection: 'row',
  },
  toFromContainer: {
    borderTopColor: colors.inputBorder,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.inputBackground,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(12),
  },
  symbol: {
    fontFamily: fonts.muliBold,
    color: colors.text,
    fontSize: percentWidth(4.5),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.04,
  },
  sectionTitle: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: percentHeight(2),
  },
  names: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  balAmount: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 28,
  },
  toFromText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  toFromAddressText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  memo: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 13,
    paddingTop: 5,
  },
})
