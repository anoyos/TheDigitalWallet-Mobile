import React from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { Icon } from 'react-native-elements'
import SafeAreaView from 'react-native-safe-area-view'
import { screenWidth, fonts, colors, percentWidth, shadow, headers } from 'app/styles'
import Logo from 'app/assets/images/logo.png'

export default function MainHeader({ navigation, withBack }) {
  if (withBack) {
    return (
      <SafeAreaView  style={{
        height: 50,

        alignContent: 'center',

        flexDirection: 'row',
      }}>
        <View style={styles.sideContainer}>
          <Button
            shadeBorderRadius={100}
            color="transparent"
            style={styles.button}
            onPress={navigation.goBack}
          >
            <Icon
              name="arrow-left"
              type="material-community"
              color="#000000"
              size={percentWidth(6)}
            />
          </Button>
        </View>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={{ width: percentWidth(35), height: percentWidth(6.704545456) }} />
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={headers.container}>
      <View style={styles.sideContainer} />
      <View style={styles.logoContainer}>
        <Image source={Logo} style={{ width: percentWidth(35), height: percentWidth(6.704545456) }} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    width: screenWidth * 0.55,
    paddingLeft: screenWidth * 0.15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: percentWidth(1.5),
  },
  sideContainer: {
    width: percentWidth(15),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    width: percentWidth(9.2),
    height: percentWidth(9.2),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


// import React from 'react'
// import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
// import { Icon } from 'react-native-elements'
// import SafeAreaView from 'react-native-safe-area-view'
// import { screenWidth, headers, percentWidth } from 'app/styles'
// import Logo from 'app/assets/images/logo.png'

// export default function MainHeader({ navigation, withBack }) {
//   if (withBack) {
//     return (
//       <SafeAreaView forceInset={{ top: 'always' }} style={headers.container}>
//         <TouchableOpacity style={styles.menuContainer} onPress={() => navigation.goBack(null)}>
//           <Icon
//             name="arrow-left"
//             type="material-community"
//             color="#000000"
//             size={23}
//           />
//         </TouchableOpacity>
//         <View style={[styles.logoContainer, { width: withBack ? screenWidth * 0.6 : screenWidth }]}>
//           <Image source={Logo} style={{ width: percentWidth(35), height: percentWidth(6.704545456) }} />
//         </View>
//         <View style={styles.menuContainer} />
//       </SafeAreaView>
//     )
//   }
//   return (
//     <SafeAreaView forceInset={{ top: 'always' }} style={headers.container}>
//       <View style={[styles.logoContainer, { width: withBack ? screenWidth * 0.6 : screenWidth }]}>
//         <Image source={Logo} style={{ width: percentWidth(35), height: percentWidth(6.704545456) }} />
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   logoContainer: {
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 6,
//   },
//   menuContainer: {
//     width: screenWidth * 0.2,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: percentWidth(1),
//   },
// })
