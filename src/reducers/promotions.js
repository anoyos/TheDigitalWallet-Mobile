import { distance } from 'app/lib/location'

export default function promotionsReducer(promotions, action) {
  switch (action.type) {
    case 'setPromotions':
      return action.payload
    case 'setPromotionsDistances': {
      const { latitude, longitude } = action.payload
      return promotions.map((p) => ({
        ...p,
        distanceFromLocation: distance(
          latitude, longitude,
          p.latitude, p.longitude,
        ),
      }))
    }
    default:
      return promotions
  }
}
