import {Alert} from 'react-native';
import Toast from 'react-native-root-toast';

export function inactive() {
  setTimeout(() => {
    Alert.alert('', 'You have been logged out due to inactivity.', {
      cancelable: false,
    });
  }, 500);
  // Toast.show('You have been logged out due to inactivity.', {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function message(text, extraHeight = 0) {
  console.log('message in text............. ', text);
  setTimeout(() => {
    Alert.alert('', text, {cancelable: false});
  }, 500);
  // Toast.show(text, {
  //   duration: Toast.durations.LONG,
  //   position: -50 - extraHeight,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function copyReferralCode() {
  setTimeout(() => {
    Alert.alert('', 'Referral code copied to clipboard.', {cancelable: false});
  }, 500);
  // Toast.show('Referral code copied to clipboard.', {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function copyAddress() {
  setTimeout(() => {
    Alert.alert('', 'Wallet address copied to clipboard.', {cancelable: false});
  }, 500);
  // Toast.show('Wallet address copied to clipboard.', {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function copyLink() {
  setTimeout(() => {
    Alert.alert('', 'Invite link copied to clipboard.', {cancelable: false});
  }, 500);
  // Toast.show('Invite link copied to clipboard.', {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function confirmationSent() {
  setTimeout(() => {
    Alert.alert('', 'A new confirmation code was sent.', {cancelable: false});
  }, 500);
  // Toast.show('A new confirmation code was sent.', {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}

export function error(err) {
  let text;
  console.log('error..... ', err);
  // if (err.code === 'UserNotFoundException') {
  //   text = 'Email address is incorrect.';
  // } else if (err.message === 'Incorrect username or password.') {
  //   text = 'Password is incorrect.';
  // } else if (
  //   err.message ===
  //   "undefined is not an object (evaluating 'dbUser.encrypted_key')"
  // ) {
  //   text =
  //     'The network appears to be experiencing downtime. Please try again later.';
  // } else if (err === '"verifyPassword" must be one of [ref:password]') {
  //   text = 'Passwords must match.';
  // } else {
  //   text = err && err.message ? err.message : err;
  // }

  // setTimeout(() => {
  //   Alert.alert('', text, {cancelable: false});
  // }, 500);
  // // Toast.show(text, {
  // //   duration: Toast.durations.LONG,
  // //   position: -50,
  // //   shadow: true,
  // //   animation: true,
  // //   hideOnPress: true,
  // //   delay: 0,
  // // });
}

export function info(err) {
  let text;

  if (err.code === 'UserNotFoundException') {
    text = 'Email address is incorrect.';
  } else if (err.message === 'Incorrect username or password.') {
    text = 'Password is incorrect.';
  } else if (
    err.message ===
    "undefined is not an object (evaluating 'dbUser.encrypted_key')"
  ) {
    text =
      'The network appears to be experiencing downtime. Please try again later.';
  } else if (err === '"verifyPassword" must be one of [ref:password]') {
    text = 'Passwords must match.';
  } else {
    text = err && err.message ? err.message : err;
  }

  setTimeout(() => {
    Alert.alert('', text, {cancelable: false});
  }, 500);
  // Toast.show(text, {
  //   duration: Toast.durations.LONG,
  //   position: -50,
  //   shadow: true,
  //   animation: true,
  //   hideOnPress: true,
  //   delay: 0,
  // });
}
