export default function purchaseReducer(purchase, action) {
  switch (action.type) {
    case 'setPurchase':
      return { ...purchase, ...action.payload }
    case 'resetPurchase':
      return {
        amount: '',
        plan: {},
        source: {},
        type: '',
        currency: '',
      }
    default:
      return purchase
  }
}
