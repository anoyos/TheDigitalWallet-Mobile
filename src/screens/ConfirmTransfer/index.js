import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { SubHeader } from 'app/components/Headers'
import { getState } from 'app/lib/react-simply'
import { localize } from 'app/lib/currency'
import { FullWidthButton, CompletedModal, ConfirmationListItem } from 'app/components'
import { colors, containers, fonts, screenHeight, percentWidth, percentHeight } from 'app/styles'
import * as toast from 'app/lib/toast'
import { PAIRS } from 'app/lib/constants'
import * as api from 'app/lib/api'
import Ethereum from 'app/lib/eth'

export default function ConfirmTransfer({ navigation }) {
  const [loading, setLoading] = useState(false)
  const businessName = navigation.getParam('businessName', false)
  const [completed, setCompleted] = useState(false)
  const [{ user, currencies, transfer: { toAddress, amount, fromSymbol, toEmail } }] = getState()
  const [symbolImage, setSymbolImage] = useState({})

  useEffect(() => {
    if (fromSymbol) {
      const { image } = PAIRS.filter((pair) => pair.symbol === fromSymbol)[0]
      setSymbolImage(image)
    }
  }, [fromSymbol])

  const handleConfirmationPress = () => {
    setLoading(true)
    const salt = parseInt(Math.random().toString().slice(-5), 10)
    Ethereum.create(user).then((eth) => {
      eth.digitallTransfer(toAddress, amount, salt, fromSymbol).then(async () => {
        await api.createNotification({
          aws_user_id: user.id,
          message: `Transfered ${localize(amount, user.locales, currencies[fromSymbol].decimals)} ${fromSymbol} to ${toEmail}`,
          payload: JSON.stringify({
            type: 'transfer',
            toAddress,
            toEmail,
            amount,
            symbol: fromSymbol,
          }),
        })
        setLoading(false)
        setCompleted(true)
      }).catch((err) => {
        toast.error(err && err.message ? err.message : err)
        setLoading(false)
      })
    })
  }

  return (
    <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Confirm Transfer" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: percentHeight(23) }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.amount}>{localize(amount, user.locales, currencies[fromSymbol].decimals)}</Text>
            <Text style={styles.character}>{` ${currencies[fromSymbol].displaySymbol}`}</Text>
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
            value={businessName || toEmail}
          />
          <ConfirmationListItem
            title="Amount"
            value={`${localize(amount, user.locales, currencies[fromSymbol].decimals)} ${fromSymbol}`}
          />
          <ConfirmationListItem
            title="Total"
            value={`${localize(amount, user.locales, currencies[fromSymbol].decimals)} ${fromSymbol}`}
            total
          />
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'flex-end' }}>
          <FullWidthButton
            onPress={handleConfirmationPress}
            condition={loading || user[`${fromSymbol}Balance`] < parseInt(amount, 10)}
            title="Complete Transaction"
            loading={loading}
          />
        </View>
      </View>
      <CompletedModal
        completed={completed}
        completedMessage={`You have successfully transferred ${localize(amount, user.locales, currencies[fromSymbol].decimals)} ${fromSymbol} to ${toEmail}`}
        handleClosePress={() => {
          setCompleted(false)
          navigation.popToTop()
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  amount: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: percentWidth(12),
  },
  character: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: screenHeight * 0.04,
  },
})
