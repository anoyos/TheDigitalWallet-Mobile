export default function giftCardsReducer(giftCards, action) {
  switch (action.type) {
    case 'setGiftCards':
      return { ...giftCards, ...action.payload }
    case 'setPendingGiftCards':
      return { ...giftCards, pending: action.payload }
    case 'setAcceptedGiftCards':
      return { ...giftCards, accepted: action.payload }
    case 'resetGiftCards':
      return {
        pending: [],
        accepted: [],
      }
    default:
      return giftCards
  }
}
