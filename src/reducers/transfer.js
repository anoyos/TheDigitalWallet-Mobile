export default function transferReducer(transfer, action) {
  switch (action.type) {
    case 'setTransfer':
      return { ...transfer, ...action.payload }
    case 'clearTransfer':
      return {
        name: '',
        amount: '',
        toAddress: '',
        memo: '',
        type: '',
        toSymbol: '',
        fromSymbol: '',
        toEmail: '',
      }
    default:
      return transfer
  }
}
