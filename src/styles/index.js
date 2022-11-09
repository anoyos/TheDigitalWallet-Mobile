import { Dimensions, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export const screenHeight = Dimensions.get('window').height
export const screenWidth = Dimensions.get('window').width
export const percentWidth = (percentage) => screenWidth * (percentage / 100)
export const percentHeight = (percentage) => screenHeight * (percentage / 100)
export const headerHeight = percentHeight(5)
export const statusBarHeight = getStatusBarHeight()

export const fonts = {
  regular: 'Muli-Regular',
  semiBold: 'Muli-SemiBold',
  bold: 'Muli-Bold',
  openSansBold: 'Muli-Bold',
  muliBold: 'Muli-SemiBold',
  avenir: 'Muli-Regular',
  avenirBold: 'Muli-Bold',
}

export const shadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.20,
  shadowRadius: 1.41,
  elevation: 2,
}

export const colors = {
  primaryColor: '#000013',
  secondaryColor: '#063967',
  bgColor: '#FFFFFF',
  walletGradient: ['#063967', '#000013'],
  giftGradient: ['#0a61af', '#000075'],
  arrowBorder: 'rgba(110,134,249,1)',
  inputBackground: '#F6F6F6',
  arrowBackground: 'rgba(110,134,249,.45)',
  inputBorder: '#bdbdbd',
  inactiveTab: 'rgba(255,255,255,.24)',
  activeTab: '#D877DB',
  pink: 'rgb(152,108,33)',
  skyBlue: '#1e88e5',
  header: '#363466',
  buttonText: '#ffffff',
  text: '#000000',
  lightText: '#bdbdbd',
  twitterBlue: '#5c9eff',
  redBalehu: '#e63d32',
}

export const images = StyleSheet.create({
  imageStretch: {
    flex: 1,
    alignSelf: 'stretch',
    width: undefined,
    height: undefined,
  },
})

export const containers = StyleSheet.create({
  screenTitleContainer: {
    height: screenHeight * 0.131,
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  screenContainer: {
    flex: 1,
    paddingTop: percentWidth(10),
  },
})

export const headers = StyleSheet.create({
  container: {
    height: percentWidth(10),
    zIndex: 100,
    position: 'absolute',
    width: screenWidth,
    flexDirection: 'row',
    backgroundColor: colors.bgColor,
    borderBottomColor: 'rgba(0,0,19,0.05)',
    borderBottomWidth: 1.3,
  },
  title: {
    fontFamily: fonts.avenirBold,
    letterSpacing: -0.25,
    fontSize: percentWidth(5.5),
    color: colors.primaryColor,
  },
})

export const text = StyleSheet.create({
  screenTitleText: {
    left: '4.5%',
    fontFamily: fonts.bold,
    color: colors.text,
    letterSpacing: -0.75,
    fontSize: 24,
    width: '80%',
  },
  errorText: {
    color: colors.redBalehu,
    fontFamily: fonts.regular,
    fontSize: 12,
    alignItems: 'center',
    textAlign: 'center',
  },
  loading: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: -0.6,
  },
  whiteLoading: {
    color: '#FFFFFF',
    fontFamily: fonts.muliBold,
    textAlign: 'center',
    fontSize: screenWidth * 0.045,
    letterSpacing: -0.6,
  },
  header: {
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: percentWidth(4.2),
  },
})
