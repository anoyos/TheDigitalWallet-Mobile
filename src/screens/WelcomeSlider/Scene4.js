import React from 'react'
import { View, Image, Text } from 'react-native'
import BackgroundImage from 'app/assets/images/slider-5.jpg'
import { percentWidth, colors, fonts, percentHeight } from 'app/styles'

export default function Scene4({ style, width }) {
  return (
    <>
      <View style={[style, { width, backgroundColor: colors.bgColor }]}>
        <Image source={BackgroundImage} style={{ height: percentHeight(100), width: percentWidth(100), position: 'absolute' }} resizeMode="cover" />
        <View style={{ height: percentHeight(100), width: percentWidth(100), backgroundColor: 'black', opacity: 0.6, position: 'absolute' }} />
        <View style={{ height: percentHeight(20), alignItems: 'flex-end', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>THE DIGIT</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>ALL</Text>
          <Text style={{ fontSize: percentWidth(8), fontFamily: fonts.avenirBold, color: 'white' }}>{` WALLET`}</Text>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', marginVertical: percentHeight(7) }}>
          <Text style={{ fontSize: percentWidth(6), fontFamily: fonts.avenirBold, color: 'white' }}>THE WORLDS MOST</Text>
          <Text style={{ fontSize: percentWidth(6), fontFamily: fonts.avenirBold, color: 'white' }}>ENVIRONMENTALLY FRIENDLY</Text>
          <Text style={{ fontSize: percentWidth(6), fontFamily: fonts.avenirBold, color: 'white' }}>PAYMENT SOLUTION</Text>
        </View>
        <View style={{ justifyContent: 'space-between', alignItems: 'center', height: percentHeight(28) }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>Today there are currently 14 billion</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>credit and debit cards in circulation.</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>150 billion paper bank notes are</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>printed each year; in 2018 the cost</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>to produces these, was $58 billion.</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>IT'S TIME TO CONSIGN THESE</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>OUTDATED METHODS OF PAYMENT</Text>
            <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>TO HISTORY, TIME TO GO DIGITALL</Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(11), position: 'absolute', alignSelf: 'center', flexDirection: 'row' }}>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>
            THE DIGIT
          </Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: '#828282', marginLeft: -percentWidth(0.5) }}>
            ALL
          </Text>
          <Text style={{ fontSize: percentWidth(4.5), fontFamily: fonts.avenirBold, color: 'white' }}>
           {` WALLET OF THE FUTURE`}
          </Text>
        </View>
      </View>
    </>
  )
}

// import React from 'react'
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { percentWidth, colors, fonts, percentHeight } from 'app/styles'
// import { PillButton } from 'app/components'
// import Lock from 'app/assets/images/lock.jpg'
// import NavigationService from 'app/lib/NavigationService'

// export default function Scene5({ style, width }) {
//   return (
//     <View style={[style, { width, backgroundColor: colors.bgColor }]}>
//       <View style={{ height: percentHeight(14), justifyContent: 'flex-end', alignItems: 'center' }}>
//         <Text style={{ fontSize: percentWidth(9.3), fontFamily: fonts.avenirBold }}>DIGITALL MONEY</Text>
//       </View>
//       <View style={{ height: percentHeight(8), justifyContent: 'center' }}>
//         <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//           <Text style={{ fontSize: percentWidth(3.3), fontFamily: fonts.avenir }}>
//             The Digitall Wallet allows users to hold and transactionally
//           </Text>
//           <Text style={{ fontSize: percentWidth(3.3), fontFamily: fonts.avenir }}>
//             spend all of the following types of money
//           </Text>
//         </View>
//       </View>
//       <View style={{ height: percentHeight(25), justifyContent: 'space-evenly' }}>
//         <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: percentHeight(2) }}>
//           <Text style={styles.currencies}>
//             G10 Fiat Currencies
//           </Text>
//           <Text style={styles.currencies}>
//             Platinum
//           </Text>
//           <Text style={styles.currencies}>
//             Gold
//           </Text>
//           <Text style={styles.currencies}>
//             Silver
//           </Text>
//           <Text style={styles.currencies}>
//             Oil
//           </Text>
//           <Text style={styles.currencies}>
//             Listed Stocks
//           </Text>
//           <Text style={styles.currencies}>
//             and
//           </Text>
//           <Text style={styles.currencies}>
//             Cryptocurrencies
//           </Text>
//         </View>
//       </View>
//       <Image source={Lock} style={{ width: percentHeight(13.3797909408), height: percentHeight(16), alignSelf: 'center', marginTop: percentHeight(2), zIndex: 6 }} />
//       {/* <Image source={Currencies} style={{ width: percentWidth(99), height: percentWidth(44.7150000033), alignSelf: 'center', marginTop: -percentHeight(1), zIndex: 0 }} /> */}
//       <View style={{ justifyContent: 'center', alignItems: 'center', bottom: percentHeight(12), position: 'absolute', alignSelf: 'center' }}>
//         <Text style={{ fontSize: percentWidth(3), fontFamily: fonts.bold, marginBottom: percentHeight(5) }}>
//           THE FUTURE OF MONEY TRANSFERS AND PURCHASES
//         </Text>
//         <PillButton
//           onPress={() => NavigationService.navigate('App')}
//           title="Get Started"
//           height={percentWidth(12)}
//           width={percentWidth(50)}
//           titleColor="#FFFFFF"
//         />
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   currencies: {
//     fontSize: percentWidth(4),
//     fontFamily: fonts.avenirBold,
//   },
// })
