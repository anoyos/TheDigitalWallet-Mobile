import userReducer from './user'
import businessesReducer from './businesses'
import transactionsReducer from './transactions'
import promotionsReducer from './promotions'
import purchaseReducer from './purchase'
import plansReducer from './plans'
import cartReducer from './cart'
import transferReducer from './transfer'
import timerReducer from './timer'
import notificationsReducer from './notifications'
import giftCardsReducer from './giftCards'
import referralsReducer from './referrals'
import currenciesReducer from './currencies'
import communityTransactionsReducer from './communityTransactions'
import friendsReducer from './friends'
import bankAccountsReducer from './bankAccounts'
import moneyReceivedReducer from './moneyReceived'
import contractValuesReducer from './contractValues'

export default function Reducer(state, action) {
  return {
    user: userReducer(state.user, action),
    businesses: businessesReducer(state.businesses, action),
    transactions: transactionsReducer(state.transactions, action),
    promotions: promotionsReducer(state.promotions, action),
    purchase: purchaseReducer(state.purchase, action),
    plans: plansReducer(state.plans, action),
    cart: cartReducer(state.cart, action),
    currencies: currenciesReducer(state.currencies, action),
    referrals: referralsReducer(state.referrals, action),
    giftCards: giftCardsReducer(state.giftCards, action),
    notifications: notificationsReducer(state.notifications, action),
    timer: timerReducer(state.timer, action),
    transfer: transferReducer(state.transfer, action),
    communityTransactions: communityTransactionsReducer(state.communityTransactions, action),
    friends: friendsReducer(state.friends, action),
    contractValues: contractValuesReducer(state.contractValues, action),
    moneyReceived: moneyReceivedReducer(state.moneyReceived, action),
    bankAccounts: bankAccountsReducer(state.bankAccounts, action),
  }
}
