import { PermissionsAndroid, Platform } from 'react-native'

export async function askContactsPermissions() {
  if (Platform.OS === 'ios') return true

  let result = false
  try {
    result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
    if (!result) {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Digitall Contacts Permission',
          message: 'Earn money from Digitall by sharing with friends.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ) === PermissionsAndroid.RESULTS.GRANTED
    }
  } catch (err) {
    console.warn(err) // eslint-disable-line no-console
    throw err
  }

  return result
}

export default async function askLocationPermissions() {
  if (Platform.OS === 'ios') return true

  let result = false
  try {
    result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (!result) {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Digitall Location Permission',
          message: 'Digitall helps you find great services near you',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ) === PermissionsAndroid.RESULTS.GRANTED
    }
  } catch (err) {
    console.warn(err) // eslint-disable-line no-console
    throw err
  }

  return result
}

export function distance(lat1, lon1, lat2, lon2) {
  const R = 6371 // km (change this constant to get miles)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

export function distanceToUnit(d) {
  if (d <= 1) {
    return `${Math.round(d * 1000)} m`
  }
  return `${Math.round(d)} km`
}
