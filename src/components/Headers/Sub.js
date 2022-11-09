import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {Button} from 'react-native-material-buttons';
import SafeAreaView from 'react-native-safe-area-view';
import {percentWidth, headers} from 'app/styles';

export default function SubHeader({navigation, title, homeButton = true}) {
  return (
    <SafeAreaView
      style={{
        height: 70,

        alignContent: 'center',

        flexDirection: 'row',
      }}>
      <View style={styles.buttonContainer}>
        <Button
          shadeBorderRadius={100}
          color="transparent"
          style={styles.button}
          onPress={navigation.goBack}>
          <Icon
            name="arrow-left"
            type="material-community"
            color="#000000"
            size={percentWidth(6)}
          />
        </Button>
      </View>
      <View style={styles.titleContainer}>
        <Text style={headers.title}>{title}</Text>
      </View>
      {homeButton && (
        <View style={styles.buttonContainer}>
          <Button
            shadeBorderRadius={100}
            color="transparent"
            style={styles.button}
            onPress={navigation.popToTop}>
            <Icon
              name="home-outline"
              type="material-community"
              color="#000000"
              size={percentWidth(6)}
            />
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
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
});
