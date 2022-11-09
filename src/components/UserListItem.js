import React from 'react'
import { View, Text, Image } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { getState } from 'app/lib/react-simply'
import { colors, fonts, screenWidth } from 'app/styles'
import NavigationService from 'app/lib/NavigationService'
import * as image from 'app/assets/images/avatars'

export default function UserListItem({ user, symbol }) {
  const [, dispatch] = getState()
  const selectUser = () => {
    const payload = { name: user.name, toAddress: user.walletAddress, toEmail: user.email, fromSymbol: symbol }
    dispatch({ type: 'setTransfer', payload })
    NavigationService.navigate('TransferAmount')
  }

  return (
    <Button
      onPress={selectUser}
      color="transparent"
      disabledColor="transparent"
      disabled={!user.walletAddress}
      style={{
        flexDirection: 'row',
        height: screenWidth * 0.17,
        width: screenWidth,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          width: '82%',
          borderBottomColor: colors.lightText,
          borderBottomWidth: 0.5,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.regular,
            fontSize: screenWidth * 0.038,
            marginBottom: screenWidth * 0.002,
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            color: '#808080',
            fontFamily: fonts.regular,
            fontSize: screenWidth * 0.033,
            marginTop: screenWidth * 0.002,
          }}
        >
          {user.email}
        </Text>
      </View>
    </Button>
  )
}
