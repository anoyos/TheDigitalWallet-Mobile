import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from 'react-native-material-buttons';
import {
  colors as globalColors,
  fonts,
  percentWidth,
  shadow,
  percentHeight,
} from 'app/styles';

export default function FullWidthButton({
  onPress,
  title,
  condition,
  angle = 90,
  colors = ['#063967', '#000013'],
  paddingVertical = percentHeight(2),
  marginBottom = 0,
  loading,
}) {
  return (
    <View style={{paddingVertical, marginBottom}}>
      <Button
        disabled={condition}
        onPress={onPress}
        style={[styles.button, {...shadow}]}>
        <LinearGradient
          colors={colors}
          angle={angle}
          useAngle
          style={[styles.button, {opacity: condition ? 0.5 : 1}]}>
          {loading ? (
            <ActivityIndicator color={colors.bgColor} size="small" />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
        </LinearGradient>
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    height: percentWidth(13),
    width: percentWidth(85),
    borderRadius: percentWidth(2),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    color: globalColors.buttonText,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    fontSize: percentWidth(4.6),
    letterSpacing: -0.6,
  },
});
