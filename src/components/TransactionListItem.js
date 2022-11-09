import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { localize } from 'app/lib/currency'
import { colors, fonts, screenWidth, percentWidth } from 'app/styles'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function TransactionListItem(props) {
  const date = new Date(props.timestamp * 1000)
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const formattedDate = `${day} ${month} ${year}`
  const [{ user: { locales, walletAddress } }] = getState()

  if (props.pending) {
    const pendingDate = new Date(props.createdAt)
    const m = months[pendingDate.getMonth()]
    const d = pendingDate.getDate()
    const y = pendingDate.getFullYear()
    return (
      <View style={[styles.container, { borderColor: colors.primaryColor }]}>
        <View style={{ width: '70%' }}>
          <View style={{ height: '27%', justifyContent: 'flex-end', left: 16 }}>
            <Text style={styles.date}>Pending</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', left: 16 }}>
            <View style={{ width: '70%' }}>
              <View style={{ height: '55%', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={styles.mediumText}>Debit Card Purchase</Text>
              </View>
              <View style={{ height: '45%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.smallText}>{`${d} ${m} ${y}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.mediumText, { color: 'green' }]}>{`+ ${localize(props.balAmount / (10 ** 6), locales)}`}</Text>
          <Text style={styles.smallText}>Pending...</Text>
        </View>
      </View>
    )
  }

  if (props.addressFrom === '0x0000000000000000000000000000000000000000') {
    return (
      <View style={[styles.container, { borderColor: colors.primaryColor }]}>
        <View style={{ width: '70%' }}>
          <View style={{ height: '27%', justifyContent: 'flex-end', left: 16 }}>
            <Text style={styles.date}>Money Received</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', left: 16 }}>
            <View style={{ width: '70%' }}>
              <View style={{ height: '55%', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={styles.mediumText}>Debit Card Purchase</Text>
              </View>
              <View style={{ height: '45%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.smallText}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.mediumText, { color: 'green' }]}>{`+ ${localize(props.value / (10 ** 6), locales)}`}</Text>
        </View>
      </View>
    )
  }

  // Transaction sent from user.
  if (props.addressFrom.toUpperCase() === walletAddress.toUpperCase()) {
    return (
      <View style={[styles.container, { borderColor: colors.primaryColor }]}>
        <View style={{ width: '70%' }}>
          <View style={{ height: '27%', justifyContent: 'flex-end', left: 16 }}>
            <Text style={styles.date}>Money Sent</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', left: 16 }}>
            <View style={{ width: '70%' }}>
              <View style={{ height: '55%', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={styles.mediumText}>{props.toBusinessName || `${props.addressTo.slice(0, 5)}...${props.addressTo.slice(-5)}`}</Text>
              </View>
              <View style={{ height: '45%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.smallText}>{formattedDate}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.mediumText, { color: 'red' }]}>{`- ${localize(props.value / (10 ** 6), locales)}`}</Text>
        </View>
      </View>
    )
  }

  // Transaction sent to user.
  return (
    <View style={[styles.container, { borderColor: colors.primaryColor }]}>
      <View style={{ width: '70%' }}>
        <View style={{ height: '27%', justifyContent: 'flex-end', left: 16 }}>
          <Text style={styles.date}>Money Received</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', left: 16 }}>
          <View style={{ width: '70%' }}>
            <View style={{ height: '55%', justifyContent: 'center' }}>
              <Text numberOfLines={1} style={styles.mediumText}>{props.fromBusinessName || `${props.addressFrom.slice(0, 5)}...${props.addressFrom.slice(-5)}`}</Text>
            </View>
            <View style={{ height: '45%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.smallText}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.mediumText, { color: 'green' }]}>{`+ ${localize(props.value / (10 ** 6), locales)}`}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    height: 87,
    width: screenWidth,
    borderBottomWidth: 0.5,
    backgroundColor: 'rgba(0,0,0,0)',
    marginVertical: percentWidth(1),
    flexDirection: 'row',
  },
  date: {
    fontFamily: fonts.regular,
    color: colors.text,
    opacity: 0.8,
    fontSize: 12,
    letterSpacing: -0.35,
  },
  mediumText: {
    fontFamily: fonts.regular,
    color: colors.text,
    fontSize: 14,
    letterSpacing: -0.35,
  },
  smallText: {
    fontFamily: fonts.regular,
    color: colors.text,
    opacity: 0.5,
    fontSize: 12,
    letterSpacing: -0.35,
  },
  balContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
