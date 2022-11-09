import React from 'react'
import { TouchableOpacity } from 'react-native'
import XIcon from 'app/assets/images/icons/XIcon'
import { screenHeight } from 'app/styles'

export default function XButton({ onPress, top }) {
  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        top: top || screenHeight * 0.055,
        right: '4.67%',
        position: 'absolute',
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <XIcon />
    </TouchableOpacity>
  )
}
