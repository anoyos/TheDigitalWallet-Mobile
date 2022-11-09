export default function transactionsReducer(transactions, action) {
  switch (action.type) {
    case 'setTransactions':
      return action.payload
    case 'resetTransactions':
      return []
    default:
      return transactions
  }
}
