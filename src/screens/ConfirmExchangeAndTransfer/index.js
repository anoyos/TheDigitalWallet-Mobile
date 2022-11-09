import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { localize } from 'app/lib/currency'
import { PAIRS } from 'app/lib/constants'
import { FullWidthButton, CompletedModal, ConfirmationListItem } from 'app/components'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import Ethereum from 'app/lib/eth'
import { colors, containers, fonts, screenHeight, percentWidth, percentHeight } from 'app/styles'

export default function ConfirmExchangeAndTransfer({ navigation }) {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const exchangeRate = navigation.getParam('exchangeRate', false)
  const businessName = navigation.getParam('businessName', false)
  const fromSymbol = navigation.getParam('fromSymbol', false)
  const fromAmount = navigation.getParam('fromAmount', false)
  const fromAddress = navigation.getParam('fromAddress', false)
  const toAddress = navigation.getParam('toAddress', false)
  const toAmount = navigation.getParam('toAmount', false)
  const nonce = navigation.getParam('nonce', false)
  const sig = navigation.getParam('sig', false)
  const [symbolImage, setSymbolImage] = useState({})
  const [{ user, currencies, transfer }] = getState()

  useEffect(() => {
    if (fromSymbol) {
      const { image } = PAIRS.filter((pair) => pair.symbol === fromSymbol)[0]
      setSymbolImage(image)
    }
  }, [fromSymbol])

  const handleConfirmationPress = async () => {
    setLoading(true)
    try {
      const salt = parseInt(Math.random().toString().slice(-5), 10)
      const eth = await Ethereum.create(user)
      await eth.approve(fromAddress, fromAmount)
      await eth.exchangeAndTransfer([fromAmount, toAmount, nonce], [fromAddress, toAddress], transfer.toAddress, sig, salt)
      await api.createNotification({
        aws_user_id: user.id,
        message: `Converted and transfered ${localize(transfer.amount, user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.fromSymbol} to ${transfer.name}`,
        payload: JSON.stringify({
          type: 'transfer',
          from: user.walletAddress,
          to: transfer.toAddress,
          amount: transfer.amount,
        }),
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
      <SubHeader title="Exchange and Transfer" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: percentHeight(23) }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.amount}>{localize((toAmount / (10 ** 6)) * (1 - user.exchangeFeePercentage), user.locales, currencies[transfer.toSymbol].decimals)}</Text>
            <Text style={styles.character}>{` ${currencies[transfer.toSymbol].displaySymbol}`}</Text>
          </View>
        </View>
        <View>
          <ConfirmationListItem
            title="Wallet"
            symbol={fromSymbol}
            symbolImage={symbolImage}
          />
          <ConfirmationListItem
            title="To"
            value={`${businessName || transfer.toEmail}`}
          />
          <ConfirmationListItem
            title="Amount"
            value={`${localize(fromAmount / (10 ** 6), user.locales, currencies[fromSymbol].decimals)} ${fromSymbol}`}
          />
          <ConfirmationListItem
            title="Exchange rate"
            value={`1 ${fromSymbol} ≈ ${localize(exchangeRate, user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.toSymbol}`}
          />
          <ConfirmationListItem
            title="Exchange amount"
            value={`${localize(toAmount / (10 ** 6), user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.toSymbol}`}
          />
          <ConfirmationListItem
            title="Digitall fee"
            fee={`(${user.exchangeFeePercentage * 100} %)`}
            value={`${localize((toAmount / (10 ** 6)) * user.exchangeFeePercentage, user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.toSymbol}`}
          />
          <ConfirmationListItem
            title="Total"
            value={`${localize((toAmount / (10 ** 6)) * (1 - user.exchangeFeePercentage), user.locales, currencies[transfer.toSymbol].decimals)} ${transfer.toSymbol}`}
            total
          />
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <FullWidthButton
            onPress={() => handleConfirmationPress()}
            title="Complete Transaction"
            condition={loading || completed}
            loading={loading}
          />
        </View>
      </View>
      <CompletedModal
        completed={completed}
        completedMessage={`You have successfully transfered ${transfer.toSymbol} to ${transfer.name}!`}
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
    height: screenHeight * 0.3,
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
