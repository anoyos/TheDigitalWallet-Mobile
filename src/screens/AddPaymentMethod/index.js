import React, {useState, useRef} from 'react';
import {View, Text} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {PillButton, Input, LoadingModal} from 'app/components';
import {
  containers,
  percentWidth,
  fonts,
  percentHeight,
  colors,
} from 'app/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInputMask} from 'react-native-masked-text';
import CheckBox from 'react-native-check-box';
import {getState} from 'app/lib/react-simply';
import {Button} from 'react-native-material-buttons';
import {Icon} from 'react-native-elements';

import * as Animatable from 'react-native-animatable';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';

const stripe = require('stripe-client')(
  'pk_test_51H3JftDCORTl8KZUXZjgCEcd1x3y4ZJvcaksWwvYOkblf34wnrBGxfgu75EZb179Aadx4XYgE7gJN62aZ0LqeCJm00U5gQf5eX',
  // 'pk_test_3oznhJfjqtLyHrsNFnJrO6pN004TGYcLXl',
);

const Tab = ({title, index, selectedTab, iconName, onPress}) => (
  <Button
    shadeBorderRadius={percentWidth(2)}
    color="transparent"
    disabledColor="transparent"
    disabled={index === selectedTab}
    onPress={onPress}
    style={{
      width: percentWidth(27),
      height: percentHeight(12),
      marginHorizontal: percentWidth(2),
    }}>
    <View
      style={{
        width: percentWidth(27),
        height: percentHeight(12),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          index === selectedTab ? colors.secondaryColor : 'whitesmoke',
        borderRadius: percentWidth(2),
      }}>
      <Icon
        name={iconName}
        type="font-awesome"
        color={index === selectedTab ? '#fff' : colors.text}
        size={percentWidth(6)}
      />
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: percentWidth(4),
          color: index === selectedTab ? '#fff' : colors.text,
          paddingVertical: percentWidth(1.5),
        }}>
        {title}
      </Text>
    </View>
  </Button>
);

export default function AddPaymentMethod({navigation}) {
  const [name, setName] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [expireDate, setExpireDate] = useState('');
  const [CCV, setCCV] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const tab0Ref = useRef(null);
  const tab1Ref = useRef(null);
  const tab2Ref = useRef(null);
  const [, dispatch] = getState();

  const handleTabPress = index => {
    switch (selectedTab) {
      case 0:
        tab0Ref.current.fadeOut(100);
        break;
      case 1:
        tab1Ref.current.fadeOut(100);
        break;
      default:
        tab2Ref.current.fadeOut(100);
        break;
    }
    setTimeout(() => {
      setSelectedTab(index);
      switch (index) {
        case 0:
          tab0Ref.current.fadeIn(100);
          break;
        case 1:
          tab1Ref.current.fadeIn(100);
          break;
        default:
          tab2Ref.current.fadeIn(100);
          break;
      }
    }, 125);
  };

  const getSources = async () => {
    try {
      const {sources} = await api.getSources();
      dispatch({type: 'setUserSources', payload: sources.data || []});
    } catch (err) {
      toast.error(err);
    }
  };

  const handleAddCreditCard = async () => {
    setLoading(true);
    const stripeCard = {
      card: {
        number: creditCardNumber.replace(/ /g, ''),
        exp_month: expireDate.split('/')[0],
        exp_year: expireDate.split('/')[1],
        cvc: CCV,
        name,
      },
    };
    try {
      const {id} = await stripe.createToken(stripeCard);
      await api.saveSource(id);
      await getSources();
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      toast.error(err);
    }
  };

  const displayTab = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Animatable.View
            ref={tab0Ref}
            style={{alignSelf: 'center', justifyContent: 'center'}}
            useNativeDriver>
            <View style={{marginTop: percentWidth(5)}}>
              <View
                style={{
                  height: percentWidth(85),
                  justifyContent: 'space-around',
                }}>
                <Input
                  placeholder="Cardholder Name"
                  onChangeText={value => setName(value)}
                  value={name}
                  autoCorrect={false}
                  textContentType="name"
                  height={12}
                  width={85}
                  borderRadius={3}
                  fontSize={18}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    marginVertical: 4,
                    borderColor: colors.inputBorder,
                    borderWidth: 1,
                    borderRadius: percentWidth(3),
                    height: percentWidth(12),
                    width: percentWidth(85),
                    paddingLeft: percentWidth(5),
                    paddingRight: percentWidth(5),
                    paddingTop: percentWidth(2),
                    paddingBottom: percentWidth(2),
                  }}>
                  <TextInputMask
                    placeholder="Card Number"
                    type="custom"
                    options={{mask: '9999  9999  9999  9999'}}
                    keyboardType="number-pad"
                    onChangeText={value => setCreditCardNumber(value)}
                    value={creditCardNumber}
                    borderWidth={0}
                    style={{
                      color: colors.text,
                      fontFamily: fonts.regular,
                      fontSize: 18,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: percentWidth(85),
                  }}>
                  <View>
                    <View
                      style={{
                        justifyContent: 'center',
                        marginVertical: 4,
                        borderColor: colors.inputBorder,
                        borderWidth: 1,
                        borderRadius: percentWidth(3),
                        height: percentWidth(12),
                        width: percentWidth(35),
                        paddingLeft: percentWidth(5),
                        paddingRight: percentWidth(5),
                        paddingTop: percentWidth(2),
                        paddingBottom: percentWidth(2),
                      }}>
                      <TextInputMask
                        placeholder="Exp"
                        type="datetime"
                        options={{format: 'MM/YY'}}
                        keyboardType="number-pad"
                        textContentType="creditCardNumber"
                        onChangeText={value => setExpireDate(value)}
                        value={expireDate}
                        borderWidth={0}
                        style={{
                          color: colors.text,
                          fontFamily: fonts.regular,
                          fontSize: 18,
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Input
                      placeholder="CCV"
                      labelStyle={{fontSize: 18}}
                      onChangeText={value => setCCV(value)}
                      value={CCV}
                      keyboardType="number-pad"
                      height={12}
                      width={35}
                      maxLength={4}
                      borderRadius={3}
                      fontSize={18}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    marginTop: percentHeight(2),
                  }}>
                  <CheckBox
                    style={{flex: 1}}
                    onClick={() => setChecked(!checked)}
                    isChecked={checked}
                    checkBoxColor="#2D337C"
                    rightText="Save my payment details for future purchases"
                    rightTextStyle={{color: '#2D337C'}}
                  />
                </View>
              </View>
            </View>
            <View style={{alignItems: 'center', marginTop: percentWidth(7)}}>
              <PillButton
                disabled
                onPress={handleAddCreditCard}
                height={percentWidth(12)}
                width={percentWidth(70)}
                title="Add Debit Card"
                bgColor={colors.secondaryColor}
                titleSize={percentWidth(4.3)}
              />
            </View>
          </Animatable.View>
        );
      case 1:
        return (
          <Animatable.View ref={tab1Ref} useNativeDriver>
            <View
              style={{
                width: percentWidth(100),
                backgroundColor: 'whitesmoke',
                height: percentHeight(20),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon
                name="bank"
                type="font-awesome"
                // color={}
                size={50}
              />
            </View>
            <View style={{height: percentHeight(50)}} />
          </Animatable.View>
        );
      default:
        return (
          <Animatable.View ref={tab2Ref} useNativeDriver>
            <View
              style={{
                height: percentHeight(50),
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  width: percentWidth(100),
                  height: percentHeight(20),
                  backgroundColor: 'whitesmoke',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="bitcoin"
                  type="font-awesome"
                  // color={}
                  size={50}
                />
              </View>
              <View
                style={{
                  width: percentWidth(100),
                  height: percentHeight(20),
                  backgroundColor: 'whitesmoke',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="ethereum"
                  type="material-community"
                  // color={}
                  size={50}
                />
              </View>
            </View>
          </Animatable.View>
        );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bgColor}}>
      <SubHeader navigation={navigation} />
      <KeyboardAwareScrollView
        extraScrollHeight={40}
        showsVerticalScrollIndicator={false}
        style={containers.screenContainer}>
        {/* <Text style={{ marginTop: 50, marginLeft: percentWidth(7), fontSize: percentWidth(5), fontFamily: fonts.regular }}>
          Add Payment Method
        </Text> */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: percentHeight(7),
            marginBottom: percentHeight(0),
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Tab
              title="Debit"
              index={0}
              onPress={() => handleTabPress(0)}
              selectedTab={selectedTab}
              iconName="credit-card"
            />
            <Tab
              title="Bank"
              index={1}
              onPress={() => handleTabPress(1)}
              selectedTab={selectedTab}
              iconName="bank"
            />
            <Tab
              title="Crypto"
              index={2}
              onPress={() => handleTabPress(2)}
              selectedTab={selectedTab}
              iconName="bitcoin"
            />
          </View>
          <View
            style={{
              width: percentWidth(100),
              alignItems: 'center',
              marginTop: percentHeight(2.7),
            }}>
            {displayTab()}
          </View>
        </View>

        <View style={{height: percentHeight(20)}} />
      </KeyboardAwareScrollView>
      <LoadingModal
        loading={loading}
        loadingMessage="Adding payment method..."
      />
    </View>
  );
}
