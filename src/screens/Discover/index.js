import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { getState } from 'app/lib/react-simply'
import { useFocusState } from 'react-navigation-hooks'
import askLocationPermissions from 'app/lib/location'
import { CATEGORIES } from 'app/lib/constants'
import Geolocation from '@react-native-community/geolocation'
import { colors, fonts, percentHeight, shadow, screenWidth } from 'app/styles'
import Arrow from 'app/assets/images/icons/Arrow'
import { BusinessListItem } from 'app/components'
import * as api from 'app/lib/api'
import * as toast from 'app/lib/toast'
import { TransparentHeader } from 'app/components/Headers'

const MAX_DISTANCE = 20 // km

function getCategoryImage(categoryId) {
  const category = CATEGORIES[categoryId]
  if (!category) {
    console.warn(`Category ${categoryId} not found`) // eslint-disable-line no-console
    return ''
  }
  return category.source
}

export default function Discover({ navigation }) {
  const { isFocused } = useFocusState()
  const mapRef = useRef({ animateCamera: () => {} })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [showListView, setShowListView] = useState(false)
  const [{ businesses, user }, dispatch] = getState()

  const getLocation = async (fn) => {
    await askLocationPermissions()

    Geolocation.getCurrentPosition(
      (result) => fn(null, result),
      (error) => fn(error),
      { enableHighAccuracy: true },
    )
  }

  useEffect(() => {
    getLocation((err, result) => {
      try {
        if (err) throw err
        const { coords: { latitude, longitude } } = result

        dispatch({
          type: 'setUserLocation',
          payload: { latitude, longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 },
        })

        if (mapRef.current) {
          mapRef.current
            .animateToRegion({ latitude, longitude, latitudeDelta: 0.08, longitudeDelta: 0.08 }, 1000)
        }
      } catch (e) {
        if (e.message === 'User denied access to location services.') {
          toast.error(e)
        }
      }
    })
  }, [])

  useEffect(() => {
    if (!isFocused) return
    api.getBusinesses()
      .then((payload) => dispatch({ type: 'setBusinesses', payload }))
      .then(() => dispatch({ type: 'setDistances', payload: user.coords }))
      .catch((err) => console.log(err)) // eslint-disable-line no-console
  }, [isFocused])

  const shownBusinesses = ({ maxDistance = MAX_DISTANCE } = {}) => {
    let filtered = businesses
    if (selectedCategory !== null) {
      filtered = filtered.filter((b) => b.categoryId === selectedCategory)
    }
    if (maxDistance) {
      filtered = filtered.filter((b) => b.distanceFromLocation < maxDistance)
    }
    return filtered.sort((a, b) => a.distanceFromLocation - b.distanceFromLocation)
  }

  const handleShowCallout = (business) => {
    setShowListView(false)
    const { latitude, longitude } = business
    mapRef.current.animateCamera({
      center: {
        latitude,
        longitude,
      },
    }, 10)
    setSelectedBusiness(business)
  }

  const handleCenterMap = () => {
    const { latitude, longitude } = user.coords
    mapRef.current.animateCamera({
      center: {
        latitude,
        longitude,
      },
    }, 10)
  }

  return (
    <SafeAreaView forceInset={{ bottom: 'always' }} style={{ flex: 1 }}>
      <TransparentHeader navigation={navigation} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <MapView
          // customMapStyle={MAPSTYLE}
          ref={mapRef}
          mapType="standard"
          provider={PROVIDER_GOOGLE}
          style={{ height: percentHeight(110) }}
          showsUserLocation
          showsMyLocationButton={false}
          initialRegion={{ ...user.coords }}
        >
          {shownBusinesses().map((business) => (
            <Marker
              key={business.id}
              coordinate={{
                latitude: business.latitude,
                longitude: business.longitude,
              }}
              onPress={() => handleShowCallout(business)}
            >
              <Image source={getCategoryImage(business.categoryId)} />
            </Marker>
          ))}
        </MapView>
        { !showListView && (
          selectedBusiness
            ? (
              <BusinessListItem
                business={selectedBusiness}
                closeCallout={() => setSelectedBusiness(null)}
                style={{ bottom: percentHeight(10), position: 'absolute' }}
                xButton
              />
            ) : (
              <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={() => handleCenterMap()}
              >
                <Arrow />
              </TouchableOpacity>
            )
        )}
        <View style={{ height: 53, position: 'absolute', bottom: percentHeight(0.5) }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={styles.categoryButton}
              key="allCategories"
            >
              <Text style={
                selectedCategory === null
                  ? styles.categoriesActiveText
                  : styles.categoriesInactiveText
              }
              >
                  All
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(category.id)}
                key={category.id}
                style={styles.categoryButton}
              >
                <Text style={
                  selectedCategory === category.id
                    ? styles.categoriesActiveText
                    : styles.categoriesInactiveText
                }
                >
                  { category.title }
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  categoriesInactiveText: {
    opacity: 0.6,
    color: colors.buttonText,
    fontSize: screenWidth * 0.033,
    fontFamily: fonts.muliBold,
    letterSpacing: -0.39,
  },
  categoriesActiveText: {
    color: colors.buttonText,
    fontSize: screenWidth * 0.033,
    fontFamily: fonts.muliBold,
    letterSpacing: -0.39,
  },
  currentLocationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    right: '7%',
    height: 38,
    width: 38,
    borderRadius: 100 / 2,
    backgroundColor: colors.arrowBackground,
    borderWidth: 2,
    borderColor: colors.arrowBorder,
    bottom: percentHeight(9),
  },
  categoryButton: {
    backgroundColor: colors.primaryColor,
    height: 33,
    width: screenWidth * 0.2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: screenWidth * 0.01,
    ...shadow,
  },
})
