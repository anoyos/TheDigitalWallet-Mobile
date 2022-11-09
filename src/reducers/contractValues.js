export default function contractValuesReducer(contractValues, action) {
  switch (action.type) {
    case 'setContractValues':
      return action.payload
    case 'resetContractValues':
      return {
        flatFeeValues: '',
        purchaseWithCreditCardFeeValues: '',
        purchaseWithCryptoFeeValues: '',
        purchaseWithEurCreditCardFeeValues: '',
        storageFeeValues: '',
        priceModifiers: [],
      }
    default:
      return contractValues
  }
}
