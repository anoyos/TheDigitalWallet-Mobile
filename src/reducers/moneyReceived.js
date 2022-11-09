export default function moneyReceivedReducer(moneyReceived, action) {
  switch (action.type) {
    case 'setMoneyReceived':
      return action.payload
    default:
      return moneyReceived
  }
}
