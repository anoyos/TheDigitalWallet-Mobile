export default function friendsReducer(friends, action) {
  switch (action.type) {
    case 'setFriends':
      return action.payload
    default:
      return friends
  }
}
