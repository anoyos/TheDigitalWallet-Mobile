import React from 'react'
import { FlatList, View } from 'react-native'
import { getState } from 'app/lib/react-simply'
import * as api from 'app/lib/api'
import { SubHeader } from 'app/components/Headers'
import { NotificationListItem } from 'app/components'
import { percentHeight, percentWidth } from 'app/styles'

export default function Notifications({ navigation }) {
  const [{ notifications }, dispatch] = getState()

  const handleDelete = async (notification) => {
    dispatch({ type: 'deleteNotification', payload: notification })
    await api.readNotification(notification.id)
  }

  return (
    <>
      <SubHeader title="Notifications" navigation={navigation} />
      <FlatList
        data={notifications || []}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingTop: percentWidth(30) }}
        renderItem={({ item }) => (
          <NotificationListItem
            title={item.title}
            payload={item.payload}
            time={item.time}
            message={item.message}
            handleDelete={() => handleDelete(item)}
          />
        )}
        ListFooterComponent={() => <View style={{ height: percentHeight(10) }} />}
      />
    </>
  )
}
