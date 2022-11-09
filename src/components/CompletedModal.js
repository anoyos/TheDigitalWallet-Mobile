import React from 'react'
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import { percentWidth, fonts, colors } from 'app/styles'
import Modal from 'react-native-modal'
import Check from 'app/assets/images/check.png'

export default function CompletedModal({ completed, completedMessage, handleClosePress }) {
  return (
    <Modal
      isVisible={completed}
      onBackdropPress={handleClosePress}
      useNativeDriver
    >
      <TouchableWithoutFeedback onPress={handleClosePress}>
        <Text
          style={{
            textAlign: 'right',
            color: 'white',
            fontFamily: fonts.bold,
            fontSize: percentWidth(5),
            paddingRight: percentWidth(9),
          }}
        >
          Close
        </Text>
      </TouchableWithoutFeedback>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: percentWidth(80),
          backgroundColor: 'white',
          alignSelf: 'center',
          borderRadius: 15,
          padding: percentWidth(4),
        }}
      >
        <View sty>
          <Image source={Check} style={{ width: percentWidth(40), height: percentWidth(40) }} />
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: percentWidth(5),
            marginVertical: percentWidth(3),
          }}
        >
          {completedMessage}
        </Text>
      </View>
    </Modal>
  )
}
