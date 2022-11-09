export default function referralsReducer(referrals, action) {
  switch (action.type) {
    case 'setReferrals':
      return { ...referrals, ...action.payload }
    default:
      return referrals
  }
}
