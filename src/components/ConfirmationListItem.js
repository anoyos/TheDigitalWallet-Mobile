import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { colors, fonts, percentWidth } from 'app/styles'

export default function ConfirmationListItem({
  title,
  value,
  total,
  symbol,
  symbolImage,
  fee,
}) {
  if (symbol) {
    return (
      <View style={styles.listItemContainer}>
        <Text style={[styles.listItemText, { fontFamily: total ? fonts.bold : fonts.regular }]}>
          {title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={symbolImage}
            style={{ height: percentWidth(6), width: percentWidth(6), marginRight: percentWidth(3) }}
          />
          <Text style={[styles.listItemText, {
            fontFamily: total ? fonts.bold : fonts.regular,
            color: 'rgba(0, 0, 0, 0.7)',
          }]}
          >
            {symbol}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.listItemContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.listItemText, {
          fontSize: total ? percentWidth(4.9) : percentWidth(4.1),
          fontFamily: total ? fonts.bold : fonts.regular,
        }]}
        >
          {title}
        </Text>
        {fee && (
          <Text style={[styles.listItemText, {
            fontSize: total ? percentWidth(4.9) : percentWidth(4.1),
            fontFamily: total ? fonts.bold : fonts.regular,
            color: 'rgba(0, 0, 0, 0.7)',
          }]}
          >
            {` ${fee}`}
          </Text>
        )}
      </View>
      <Text style={[styles.listItemText, {
        fontSize: total ? percentWidth(4.9) : percentWidth(4.1),
        fontFamily: total ? fonts.bold : fonts.regular,
        color: 'rgba(0, 0, 0, 0.7)',
      }]}
      >
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    height: percentWidth(13),
    justifyContent: 'space-between',
    paddingVertical: percentWidth(3),
    paddingHorizontal: percentWidth(6),
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    alignItems: 'center',
  },
  listItemText: {
    fontSize: percentWidth(4.1),
    color: colors.text,
  },
})
