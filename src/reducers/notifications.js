/* eslint-disable no-case-declarations */

export default function notificationsReducer(notifications, action) {
  switch (action.type) {
    case 'setNotifications':
      return action.payload
    case 'addNotification':
      const newNotifications = [...notifications]
      const checkItem = notifications.filter((x) => x.id === action.payload.id)
      if (!Array.isArray(checkItem) || !checkItem.length) newNotifications.push(action.payload)
      return newNotifications
    case 'deleteNotification':
      return notifications.filter((x) => x.id !== action.payload.id)
    case 'resetNotifications':
      return []
    default:
      return notifications
  }
}
