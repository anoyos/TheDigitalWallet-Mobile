import React from 'react'
import { Image, Linking } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { percentWidth } from 'app/styles'
import NavigationService from 'app/lib/NavigationService'

export default function LoyaltyCard({
  disabled,
  title,
  image,
  membershipCard,
  advertisement,
}) {
  const handlePress = () => {
    if (membershipCard) NavigationService.navigate('MembershipCard', { title })
    else if (advertisement) Linking.openURL('https://www.google.com/search?&q=advertisement')
    else NavigationService.navigate('Loyalty', { title, image })
  }

  return (
    <Button
      onPress={handlePress}
      disabled={disabled}
      disabledColor="transparent"
      shadeBorderRadius={10}
      style={{
        marginBottom: percentWidth(2),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: percentWidth(94),
        height: percentWidth(24.3166023178),
        borderRadius: 10,
        zIndex: 5,
      }}
    >
      <Image source={image} style={{ width: percentWidth(96), height: percentWidth(24.8339768352), zIndex: 0 }} />
    </Button>
  )
}

// const styles = StyleSheet.create({
// })
