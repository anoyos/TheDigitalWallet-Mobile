import Joi from 'react-native-joi';
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getState} from 'app/lib/react-simply';
import {
  FullWidthButton,
  Input,
  PlacesInput,
  BusinessImageSelect,
} from 'app/components';
import SafeAreaView from 'react-native-safe-area-view';
import {createBusiness} from 'app/lib/auth/utils';
import {CATEGORIES} from 'app/lib/constants';
import {SubHeader} from 'app/components/Headers';
import * as toast from 'app/lib/toast';
import * as api from 'app/lib/api';
import {
  colors,
  containers,
  fonts,
  percentHeight,
  percentWidth,
} from 'app/styles';
import AddressSelect from './AddressSelect';

/* eslint-disable newline-per-chained-call */
const schema = Joi.object()
  .options({
    abortEarly: false,
    allowUnknown: true,
    presence: 'required',
  })
  .keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    streetAddress: Joi.string().required(),
    image: Joi.object(),
    phone: Joi.string().required(),
    websiteUrl: Joi.string(),
    categoryId: Joi.number()
      .integer()
      .required(),
  });
/* eslint-enable newline-per-chained-call */

export default function CreateBusiness({navigation}) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedAddress, setFormattedAddress] = useState({});
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [image, setImage] = useState({});
  const [categoryId, setCategoryId] = useState(0);
  const [{user: stateUser}, dispatch] = getState();

  const handleCreateBusiness = async () => {
    setLoading(true);
    try {
      const business = {
        name,
        description,
        streetAddress,
        formattedAddress,
        phone,
        websiteUrl,
        image,
        categoryId,
      };
      const result = schema.validate(business);
      if (result.error) {
        throw result.error;
      }
      const response = await createBusiness(business, stateUser);
      await api.addToAdminGroup();
      const user = {...stateUser, admin: true, business: response};
      const stringUser = JSON.stringify(user);
      await AsyncStorage.setItem('user', stringUser);
      dispatch({type: 'setUser', payload: {...user}});
      navigation.navigate('WelcomeStack');
    } catch (err) {
      console.warn(err); // eslint-disable-line no-console
      if (err.response) {
        const msg = err.response.data.errors.map(e => e.message).join('\n');
        toast.message(msg);
      } else if (err.isJoi) {
        const msg = err.details.map(e => e.message).join('\n');
        toast.message(msg);
      } else if (
        err.message ===
        "undefined is not an object (evaluating 'image.path.split')"
      ) {
        toast.message('A business image is required to continue.');
      } else if (
        err.message === "undefined is not an object (evaluating 't.path.split')"
      ) {
        toast.message('A business image is required to continue.');
      } else {
        toast.message(err && err.message ? err.message : err);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView
        forceInset={{top: 'always', bottom: 'always'}}
        style={{flex: 1}}>
        <SubHeader
          title="Business Information"
          navigation={navigation}
          homeButton={false}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          enableOnAndroid>
          <View
            style={[
              containers.screenContainer,
              {marginTop: percentHeight(2), paddingBottom: percentHeight(5)},
            ]}>
            <BusinessImageSelect setImage={setImage} image={image} />
            <View style={{marginBottom: percentHeight(1)}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CATEGORIES.map(category => (
                  <View key={category.id} style={styles.categoriesContainer}>
                    <TouchableOpacity
                      onPress={() => setCategoryId(category.id)}>
                      <LinearGradient
                        style={
                          categoryId === category.id
                            ? styles.categoryButtonActive
                            : styles.categoryButtonInactive
                        }
                        colors={colors.walletGradient}
                        start={{x: -0.35, y: 0}}
                        end={{x: 1.08, y: -0.09}}
                        locations={[0, 1]}>
                        <Text style={styles.categoriesActiveText}>
                          {category.title}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View>
              <Input
                fontSize={percentWidth(4.1)}
                placeholder="Business name"
                onChangeText={value => setName(value)}
                value={name}
                autoCapitalize="none"
                autoCorrect={false}
                height={12}
                width={85}
                borderRadius={3}
              />
              <PlacesInput
                placeholder="Business address"
                value={
                  streetAddress.length > 47
                    ? `${streetAddress.slice(0, 47)}...`
                    : streetAddress
                }
                clearText={() => setStreetAddress('')}
                showAddress={() => setShowAddressSelect(true)}
                height={12}
                width={85}
                borderRadius={3}
              />
              <Input
                fontSize={percentWidth(4.1)}
                placeholder="Business url"
                onChangeText={value => setWebsiteUrl(value)}
                value={websiteUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                height={12}
                width={85}
                borderRadius={3}
              />
              <Input
                fontSize={percentWidth(4.1)}
                placeholder="Business phone"
                onChangeText={value => setPhone(value)}
                value={phone}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="phone-pad"
                height={12}
                width={85}
                borderRadius={3}
              />
              <Input
                placeholder="Describe your business"
                onChangeText={value => setDescription(value)}
                value={description}
                autoCorrect={false}
                multiline
                numberOfLines={3}
                height={percentHeight(4)}
                width={85}
                borderRadius={3}
                blurOnSubmit
                returnKeyType="done"
              />
            </View>
            <FullWidthButton
              onPress={handleCreateBusiness}
              condition={
                loading ||
                !name ||
                !streetAddress ||
                !websiteUrl ||
                !phone ||
                !description
              } // || Object.keys(image).length === 0}
              title={loading ? 'Loading...' : 'Create Business'}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showAddressSelect}
        onRequestClose={() => setShowAddressSelect(false)}>
        <AddressSelect
          handleClose={setShowAddressSelect}
          address={streetAddress}
          setAddress={setStreetAddress}
          setFormattedAddress={setFormattedAddress}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  photoPlaceholderText: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    color: colors.text,
    fontSize: 15,
    letterSpacing: -0.53,
  },
  categoriesContainer: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesActiveText: {
    color: colors.buttonText,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    letterSpacing: -0.39,
  },
  categoriesInactiveText: {
    opacity: 0.6,
    color: colors.buttonText,
    fontSize: 13,
    fontFamily: fonts.regular,
    letterSpacing: -0.39,
  },
  categoryButtonActive: {
    height: 33,
    width: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonInactive: {
    opacity: 0.4,
    height: 33,
    width: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
