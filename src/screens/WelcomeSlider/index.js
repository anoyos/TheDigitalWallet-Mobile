import React from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { Button } from 'react-native-material-buttons'
import { colors, screenWidth } from 'app/styles'
import ImageSlider from 'react-native-image-slider'
import Scene1 from './Scene1'
import Scene2 from './Scene2'
import Scene3 from './Scene3'
import Scene4 from './Scene4'
import Scene5 from './Scene5'
import Scene6 from './Scene6'

export default function WelcomeSlider() {
  const scenes = [
    { id: 1, component: Scene1 },
    { id: 2, component: Scene2 },
    { id: 3, component: Scene3 },
    { id: 4, component: Scene4 },
    { id: 5, component: Scene5 },
    { id: 6, component: Scene6 },
  ]

  return (
    <>
      <StatusBar backgroundColor={colors.bgColor} barStyle="dark-content" />
      <ImageSlider
        images={scenes}
        style={{ flex: 1, backgroundColor: colors.bgColor }}
        customSlide={({ index, item, style, width }) => <item.component key={index} style={style} width={width} />}
        customButtons={(position, move) => (
          <View style={{ position: 'absolute', bottom: '5%', flexDirection: 'row', alignSelf: 'center' }}>
            {scenes.map((item, index) => (
              <Button
                key={item.id}
                shadeBorderRadius={50}
                onPress={() => move(index)}
                style={position === index ? styles.circleSelected : styles.circle}
              />
            ))}
          </View>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'rgb(108,108,108)',
    width: screenWidth * 0.04,
    height: screenWidth * 0.04,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  circleSelected: {
    backgroundColor: 'rgb(114,202,250)',
    width: screenWidth * 0.04,
    height: screenWidth * 0.04,
    borderRadius: 50,
    marginHorizontal: 2,
  },
})
