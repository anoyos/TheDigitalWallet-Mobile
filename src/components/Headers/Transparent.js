import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { Button } from 'react-native-material-buttons'
import SafeAreaView from 'react-native-safe-area-view'
import { percentWidth, headers } from 'app/styles'

export default function TransparentHeader({ navigation, inviteFriends }) {
  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={[headers.container, { height: percentWidth(14), backgroundColor: 'transparent', borderBottomColor: 'transparent' }]}>
      <View style={styles.buttonContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={navigation.goBack}
        >
          <Icon
            name="arrow-left"
            type="material-community"
            color={inviteFriends ? 'white' : 'black'}
            size={percentWidth(6)}
          />
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    width: percentWidth(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: percentWidth(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: percentWidth(9.5),
    height: percentWidth(9.5),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
