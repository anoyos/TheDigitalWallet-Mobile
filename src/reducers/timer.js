export default function timerReducer(timer, action) {
  switch (action.type) {
    case 'setTimer':
      return { ...timer, ...action.payload }
    case 'resetTimer':
      return {
        id1: '',
        id2: '',
        id3: '',
        id4: '',
      }
    default:
      return timer
  }
}
