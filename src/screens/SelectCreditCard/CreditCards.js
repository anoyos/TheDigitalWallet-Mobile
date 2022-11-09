import React, { useState } from 'react'
import { FlatList, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { getState } from 'app/lib/react-simply'
import { CreditCardListItem } from 'app/components'
import * as api from 'app/lib/api'
import { colors, fonts, percentWidth } from 'app/styles'
import * as toast from 'app/lib/toast'

export default function CreditCards({ navigation }) {
  const [{ user: { sources } }, dispatch] = getState()
  const [refreshing, setRefreshing] = useState(false)

  const getSources = () => {
    setRefreshing(true)
    api.getSources()
      .then(({ sources: { data } }) => {
        const payload = { sources: data }
        dispatch({ type: 'setUser', payload })
      })
      .then(() => setRefreshing(false))
      .catch((error) => toast.error(error))
  }

  const addCreditCard = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddCreditCard')}
      style={styles.addCard}
    >
      <Text style={styles.addCardText}>Add a debit card...</Text>
    </TouchableOpacity>
  )

  const handleOnPress = (source) => {
    const payload = { source }
    dispatch({ type: 'setPurchase', payload })
    navigation.navigate('ConfirmCCPurchase')
  }

  return (
    <View style={{ flex: 1, paddingTop: percentWidth(5) }}>
      <FlatList
        data={sources}
        refreshing={refreshing}
        onRefresh={getSources}
        renderItem={({ item, index }) => (
          <View>
            <CreditCardListItem
              onPress={() => {
                if (item.funding !== 'debit') {
                  return toast.message('We are currently only accepting debit cards.')
                }
                handleOnPress(item)
              }}
              source={item}
            />
            { sources.length === index + 1 && addCreditCard()}
          </View>
        )}
        keyExtractor={(item) => `source-${item.id}`}
        ListEmptyComponent={addCreditCard()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  addCard: {
    justifyContent: 'center',
    height: 50,
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
    paddingLeft: '6%',
  },
  addCardText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
})
