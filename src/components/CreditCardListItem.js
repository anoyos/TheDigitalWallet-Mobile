import React from 'react';
import {Icon} from 'react-native-elements';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, fonts} from 'app/styles';

export default function CreditCardListItem({disabled, source, onPress}) {
  const brand2Icon = {
    'American Express': 'cc-amex',
    'Diners Club': 'cc-diners-club',
    Discover: 'cc-discover',
    JCB: 'cc-jcb',
    MasterCard: 'cc-mastercard',
    UnionPay: 'cc-stripe',
    Visa: 'cc-visa',
    Unknown: 'cc-stripe',
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.listItem}
      key={source.id}>
      <Icon
        name={brand2Icon[source.brand]}
        type="font-awesome"
        color={colors.primaryColor}
        size={30}
        containerStyle={{
          width: '25%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <View style={{width: '55%', justifyContent: 'center'}}>
        <Text style={styles.brand}>{source.brand}</Text>
        <View style={{flexDirection: 'row'}}>
          {/* <Text style={styles.funding}>{source.funding.charAt(0).toUpperCase() + source.funding.slice(1)}</Text> */}
          <Text style={styles.funding}>{source.funding}</Text>

          <Icon
            name="circle"
            type="font-awesome"
            color={colors.lightText}
            size={7}
            containerStyle={{paddingRight: 3, alignSelf: 'center'}}
          />
          <Icon
            name="circle"
            type="font-awesome"
            color={colors.lightText}
            size={7}
            containerStyle={{alignSelf: 'center'}}
          />
          <Text style={styles.last4}>{source.last4}</Text>
        </View>
      </View>
      <View
        style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}>
        <Icon
          name="chevron-right"
          type="material-community"
          color={colors.lightText}
          size={22}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emptyListText: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
    fontSize: 17,
    paddingTop: 20,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    height: 70,
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
  },
  addCard: {
    justifyContent: 'center',
    height: 50,
    borderBottomColor: colors.lightText,
    borderBottomWidth: 0.5,
    paddingLeft: '6%',
  },
  sectionTitleContainer: {
    paddingBottom: 10,
    justifyContent: 'flex-end',
  },
  sectionTitle: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    letterSpacing: -0.3,
  },
  brand: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.text,
  },
  addCardText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  funding: {
    paddingRight: 4,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.lightText,
    opacity: 0.75,
  },
  last4: {
    paddingLeft: 4,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.lightText,
    opacity: 0.75,
  },
});
