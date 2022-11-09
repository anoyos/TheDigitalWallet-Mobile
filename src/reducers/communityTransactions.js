export default function communityTransactionsReducer(communityTransactions, action) {
  switch (action.type) {
    case 'setCommunityTransactions':
      return action.payload
    case 'addCommunityTransactions':
      return communityTransactions.concat(action.payload)
    default:
      return communityTransactions
  }
}
