import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {TransparentHeader} from 'app/components/Headers';
import {PillButton} from 'app/components';
import {askContactsPermissions} from 'app/lib/location';
import Contacts from 'react-native-contacts';
import {getState} from 'app/lib/react-simply';
import Modal from 'react-native-modal';
import Background from 'app/assets/images/invite.png';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';
import {
  fonts,
  colors,
  screenWidth,
  screenHeight,
  shadow,
  percentWidth,
  percentHeight,
} from 'app/styles';
import ContactsModal from './ContactsModal';

export default function InviteFriends({navigation}) {
  const [{user}] = getState();
  const contactsModal = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [referredEmail, setReferredEmail] = useState('');

  useEffect(() => {
    askContactsPermissions().then(() => {
      Contacts.getAll((err, cs) => {
        if (err === 'denied') {
        } else {
          const array = [];
          /* eslint-disable */
          for (const c of cs) {
            for (const p of c.phoneNumbers) {
              array.push({
                name: `${c.givenName} ${c.familyName}`,
                emailAddresses: c.emailAddresses,
                phone: p.number,
                label: p.label,
              });
            }
          }
          /* eslint-enable */
          setContacts(array.sort((a, b) => a.name > b.name));
        }
      });
    });
  }, []);

  const handleSendSMSReferrals = async () => {
    const phoneNumbers = selectedContacts.map(c => c.replace(/\D/g, '')).join();
    const os = Platform.OS;
    let url = '';

    const appStoreURL =
      'https://apps.apple.com/us/app/the-digitall-wallet/id1488715558';
    const playStoreURL =
      'https://play.google.com/store/apps/details?id=com.in_one_place_digitall';

    const body = `Come join the Digitall community! \nReferral Code: \n \n${
      user.referralCode
    } \n \n${appStoreURL} \n${playStoreURL}`;

    if (os === 'android') {
      url = `sms:${phoneNumbers}?body=${body}`;
    } else {
      url = `sms:/open?addresses=${phoneNumbers}&body=${body}`;
    }

    setSelectedContacts([]);
    contactsModal.current.close();

    Linking.openURL(url);
  };

  const handleConfirmSend = async () => {
    setLoading(true);
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!regexEmail.test(referredEmail)) {
      setLoading(false);
      return alert(
        'Check to make sure that the email address you entered is correctly formatted; eg. test@email.com',
      ); // eslint-disable-line no-alert
    }

    try {
      await api.createReferral({referred_email: referredEmail});
      toast.message(`You have successfully sent an invite to ${referredEmail}`);
    } catch (err) {
      if (err.status === 403) {
      }
      toast.error(err);
    }

    setLoading(false);
    setReferredEmail('');
    return setShowModal(false);
  };

  const openContactsModal = () => contactsModal.current?.open();

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <TransparentHeader navigation={navigation} inviteFriends />
      <View style={{flex: 1}}>
        <Image
          source={Background}
          style={{
            width: screenWidth,
            height: screenHeight,
            zIndex: 0,
            position: 'absolute',
          }}
          resizeMode="stretch"
        />
        <View style={{flex: 1, marginTop: percentHeight(5)}}>
          <View
            style={{
              height: '14%',
              justifyContent: 'flex-end',
              marginLeft: percentWidth(5),
            }}>
            <Text style={styles.title}>Tell A Friend</Text>
          </View>
          <View
            style={{
              height: '10%',
              justifyContent: 'space-evenly',
              marginLeft: percentWidth(5),
            }}>
            <Text style={styles.superText}>
              Click bellow to refer the wallet to a friend.
            </Text>
            <Text style={styles.superText}>
              The more you invite the more you earn!
            </Text>
          </View>
          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              top: '35%',
              zIndex: 5,
            }}>
            <TouchableOpacity onPress={openContactsModal} style={styles.button}>
              <Text style={styles.buttonText}>OPEN CONTACTS</Text>
            </TouchableOpacity>
          </View>
          {selectedContacts.length > 0 && (
            <View
              style={{
                alignSelf: 'center',
                position: 'absolute',
                top: '45%',
                zIndex: 5,
              }}>
              <TouchableOpacity
                onPress={() => handleSendSMSReferrals()}
                style={styles.button}>
                <Text style={styles.buttonText}>SEND SELECTED</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <ContactsModal
        ref={contactsModal}
        contacts={contacts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
        handleSendSMSReferrals={handleSendSMSReferrals}
        showEmailModal={() => setShowModal(true)}
      />
      <Modal
        isVisible={showModal}
        useNativeDriver
        style={{top: -percentWidth(10)}}
        onBackdropPress={() => setShowModal(false)}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowModal(false);
          }}>
          <Text
            style={{
              textAlign: 'right',
              color: 'white',
              fontFamily: fonts.bold,
              fontSize: percentWidth(5),
              paddingRight: percentWidth(9),
            }}>
            Close
          </Text>
        </TouchableWithoutFeedback>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: percentWidth(50),
            width: percentWidth(80),
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: percentWidth(2),
          }}>
          <View
            style={{
              width: '80%',
              height: '65%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -percentWidth(2),
            }}>
            <View
              style={{height: '33.33%', alignItems: 'center', width: '100%'}}>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: percentWidth(5),
                    fontFamily: fonts.bold,
                    color: colors.text,
                    paddingBottom: percentWidth(3),
                  }}>
                  Enter email:
                </Text>
              </View>
              <View style={{width: '100%'}}>
                <TextInput
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="joesmith@email.com"
                  returnKeyType="done"
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  value={referredEmail}
                  style={{
                    paddingVertical: percentWidth(1.2),
                    paddingLeft: percentWidth(2),
                    fontSize: percentWidth(4),
                    color: colors.text,
                    borderWidth: 0.5,
                    borderRadius: percentWidth(2),
                  }}
                  onChangeText={value => setReferredEmail(value)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              height: '35%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator color={colors.primaryColor} size="large" />
            ) : (
              <PillButton
                onPress={handleConfirmSend}
                titleSize={percentWidth(3.8)}
                title="Send Referral"
                width={percentWidth(40)}
                height={percentWidth(10)}
                gradient
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pig: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.875,
    position: 'absolute',
    bottom: -screenWidth * 0.3,
    alignSelf: 'center',
    opacity: 0.2,
    zIndex: 1,
  },
  button: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  title: {
    fontFamily: fonts.avenirBold,
    fontSize: percentWidth(11),
    color: colors.buttonText,
    ...shadow,
  },
  buttonText: {
    color: colors.buttonText,
    fontFamily: fonts.bold,
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
    letterSpacing: 2,
    ...shadow,
  },
  text: {
    fontFamily: fonts.avenirBold,
    fontSize: screenWidth * 0.07,
    color: colors.buttonText,
    ...shadow,
  },
  superText: {
    fontFamily: fonts.avenirBold,
    fontSize: screenWidth * 0.035,
    color: colors.buttonText,
    letterSpacing: -0.5,
    ...shadow,
  },
});
