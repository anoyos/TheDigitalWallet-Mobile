import React from 'react'
import { View, ActivityIndicator, Text } from 'react-native'
import { colors, text } from 'app/styles'
import Modal from 'react-native-modal'

export default function LoadingModal({ loading, loadingMessage, hasBackdrop = true }) {
  return (
    <Modal
      isVisible={loading}
      useNativeDriver
      animationIn="flash"
      hasBackdrop={hasBackdrop}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.bgColor} size="large" />
        <Text style={text.whiteLoading}>{loadingMessage}</Text>
      </View>
    </Modal>
  )
}
