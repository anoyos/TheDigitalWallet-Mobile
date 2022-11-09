export default function plansReducer(plans, action) {
  switch (action.type) {
    case 'setPlans':
      return action.payload
    default:
      return plans
  }
}
