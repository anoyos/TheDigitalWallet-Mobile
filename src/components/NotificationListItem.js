import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import { Button } from 'react-native-material-buttons'
import NavigationService from 'app/lib/NavigationService'
import { fonts, colors, percentWidth } from 'app/styles'
import { GIFT_CARDS } from 'app/lib/constants'
import { Icon } from 'react-native-elements'

export default function NotificationListItem(props) {
  const { type } = JSON.parse(props.payload)

  const onPress = () => {
    switch (type) {
      case 'referral':
        NavigationService.navigate('Referrals')
        break
      default:
        break
    }
  }

  if (type === 'gift-card') {
    const { from_name: fromName, receiver_message: message, image_name: imageName } = JSON.parse(props.payload)
    const { image } = GIFT_CARDS.filter((g) => g.name === imageName)[0]
    return (
      <View style={{ width: percentWidth(85) }}>
        <Button
          shadeBorderRadius={percentWidth(3)}
          color="transparent"
          style={styles.container}
          onPress={onPress}
        >
          <View style={{ marginTop: percentWidth(6) }}>
            <Image source={image} style={{ height: percentWidth(60) * 0.6305418719, width: percentWidth(60) }} />
          </View>
          <View style={{ marginTop: percentWidth(3), width: percentWidth(60) }}>
            <Text style={{ fontSize: percentWidth(3.7), fontFamily: fonts.regular }}>{props.message}</Text>
          </View>
          <View style={{ marginTop: percentWidth(6) }}>
            <Text style={{ fontSize: percentWidth(4.2), fontFamily: fonts.regular }}>{message}</Text>
            <Text style={{ fontSize: percentWidth(4.2), fontFamily: fonts.regular }}>{`- ${fromName}`}</Text>
          </View>
        </Button>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={props.handleDelete}
        >
          <Icon
            name="close"
            type="font-awesome"
            color={colors.primaryColor}
            size={percentWidth(4.2)}
          />
        </Button>
      </View>
    )
  }

  return (
    <View style={{ width: percentWidth(85), alignSelf: 'center' }}>
      <Button
        shadeBorderRadius={percentWidth(3)}
        color="transparent"
        style={styles.container}
        onPress={onPress}
      >
        <View style={{ marginTop: percentWidth(6) }}>
          <Text style={{ fontSize: percentWidth(4.2), fontFamily: fonts.regular }}>{props.message}</Text>
        </View>
      </Button>
      <Button
        shadeBorderRadius={100}
        color="transparent"
        style={styles.button}
        onPress={props.handleDelete}
      >
        <Icon
          name="close"
          type="font-awesome"
          color={colors.primaryColor}
          size={percentWidth(4.2)}
        />
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 100,
    height: percentWidth(10),
    width: percentWidth(10),
    justifyContent: 'center',
    position: 'absolute',
    right: percentWidth(1),
    top: percentWidth(1),
    zIndex: 2,
  },
  container: {
    width: percentWidth(85),
    padding: percentWidth(5),
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: percentWidth(0.4),
    borderRadius: percentWidth(3),
    marginBottom: 10,
    zIndex: 1,
  },
})
