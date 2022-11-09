import { distance } from 'app/lib/location'

export default function businessesReducer(businesses, action) {
  switch (action.type) {
    case 'setBusinesses':
      return action.payload
    case 'setDistances': {
      const { latitude, longitude } = action.payload
      return businesses.map((b) => ({
        ...b,
        distanceFromLocation: distance(
          latitude, longitude,
          b.latitude, b.longitude,
        ),
      }))
    }
    default:
      return businesses
  }
}
