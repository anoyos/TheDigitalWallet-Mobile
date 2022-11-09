import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import { useAnimation } from 'react-native-animation-hooks'
import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import { colors, fonts, screenWidth, shadow, percentHeight } from 'app/styles'

export default function BusinessImageSelect({ setImage, image, edit }) {
  const [bool, setBool] = useState(false)
  const toggle = () => setBool(!bool)

  const clearImage = () => {
    toggle()
    setImage({})
  }

  const hiddenValue = useAnimation({
    type: 'timing',
    initialValue: 0,
    toValue: bool ? 1 : 0,
    duration: 400,
    useNativeDriver: true,
  })

  const visibleValue = useAnimation({
    type: 'timing',
    initialValue: 1,
    toValue: bool ? 0 : 1,
    duration: 400,
    useNativeDriver: true,
  })

  const pickWithCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      compressImageQuality: 1,
    })
      .then((response) => {
        ImagePicker.openCropper({
          path: response.path,
          width: 300,
          height: 200,
        }).then((croppedResponse) => {
          setImage(croppedResponse)
          toggle()
        }).catch((e) => console.log(e)) // eslint-disable-line no-console
      }).catch((e) => console.log(e)) // eslint-disable-line no-console
  }

  const pickWithLibrary = () => {
    ImagePicker.openPicker({
      compressImageQuality: 1,
      mediaType: 'photo',
    }).then((response) => {
      ImagePicker.openCropper({
        path: response.path,
        width: 300,
        height: 200,
      }).then((croppedResponse) => {
        setImage(croppedResponse)
        toggle()
      }).catch((e) => console.log(e)) // eslint-disable-line no-console
    }).catch((e) => console.log(e)) // eslint-disable-line no-console
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: percentHeight(2) }}>
      <Animated.Image
        style={{
          width: screenWidth * 0.75,
          height: screenWidth * 0.5,
          overflow: 'hidden',
          position: 'absolute',
          borderRadius: 5,
          opacity: edit ? visibleValue : hiddenValue,
        }}
        source={{ uri: image.path }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: screenWidth * 0.04,
          right: screenWidth * 0.16,
          zIndex: 1,
          opacity: edit ? visibleValue : hiddenValue,
        }}
      >
        <TouchableOpacity onPress={clearImage}>
          <Icon
            name="close"
            type="material-community"
            color={colors.text}
            containerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 26,
              height: 26,
              borderRadius: 50,
              backgroundColor: '#fff',
              ...shadow,
            }}
            size={26}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ opacity: edit ? hiddenValue : visibleValue }}>
        <TouchableOpacity
          onPress={() => pickWithCamera()}
          style={styles.touchItem}
          disabled={image.path !== undefined}
        >
          <Icon
            name="camera-image"
            type="material-community"
            color={colors.text}
            containerStyle={styles.iconContainer}
            size={33}
          />
          <View style={styles.touchItemTextContainer}>
            <Text style={styles.touchItemText}>Add from camera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickWithLibrary()}
          style={styles.touchItem}
          disabled={image.path !== undefined}
        >
          <Icon
            name="image-multiple"
            type="material-community"
            color={colors.text}
            containerStyle={styles.iconContainer}
            size={33}
          />
          <View style={styles.touchItemTextContainer}>
            <Text style={styles.touchItemText}>Choose from library</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  touchItemText: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  touchItem: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 80,
    width: screenWidth * 0.8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.inputBorder,
  },
  iconContainer: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchItemTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
})
