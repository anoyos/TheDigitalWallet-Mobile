import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SubHeader} from 'app/components/Headers';
import {useFocusState} from 'react-navigation-hooks';
import SafeAreaView from 'react-native-safe-area-view';
import {Icon} from 'react-native-elements';
import {getState} from 'app/lib/react-simply';
import * as api from 'app/lib/api';
import * as toast from 'app/lib/toast';
import {localize} from 'app/lib/currency';
import {
  colors,
  fonts,
  containers,
  percentHeight,
  percentWidth,
} from 'app/styles';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const TransactionItem = ({id, timestamp, value, locales}) => {
  const date = new Date(timestamp * 1000);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  return (
    <View style={styles.container}>
      <View style={{width: percentWidth(100), flexDirection: 'row'}}>
        <View
          style={{
            width: percentWidth(17),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: percentWidth(11),
              height: percentWidth(11),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              borderColor: colors.primaryColor,
              borderWidth: 1,
            }}>
            <Icon
              name="cube-send"
              type="material-community"
              color={colors.primaryColor}
              size={percentWidth(5.2)}
            />
          </View>
        </View>
        <View style={{width: percentWidth(55)}}>
          <Text
            style={{
              fontSize: percentWidth(4),
              fontFamily: fonts.semiBold,
              color: colors.primaryColor,
            }}>{`Transaction #${id}`}</Text>
          <Text
            style={{
              fontSize: percentWidth(3.2),
              fontFamily: fonts.regular,
              color: colors.secondaryColor,
            }}>
            {formattedDate}
          </Text>
        </View>
        <View
          style={{
            width: percentWidth(23),
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <Text
            style={{
              fontSize: percentWidth(4),
              fontFamily: fonts.regular,
              color: colors.primaryColor,
            }}>
            {localize(value / 10 ** 6, locales, 2)}
          </Text>
        </View>
      </View>
      <View
        style={{
          bottom: 0,
          position: 'absolute',
          width: percentWidth(88),
          borderBottomColor: 'rgba(0, 0, 0, 0.4)',
          borderBottomWidth: 1,
        }}
      />
    </View>
  );
};

export default function Transactions({navigation}) {
  const [
    {
      communityTransactions,
      user: {locales},
    },
    dispatch,
  ] = getState();
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const {isFocused} = useFocusState();

  useEffect(() => {
    if (!isFocused) return;
    api
      .getTransactions({limit: 10, offset})
      .then(({transactions}) => {
        dispatch({type: 'setCommunityTransactions', payload: transactions});
      })
      .catch(error => toast.error(error));
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    api
      .getTransactions({limit: 10, offset: 0})
      .then(({transactions}) => {
        setRefreshing(false);
        dispatch({type: 'setCommunityTransactions', payload: transactions});
      })
      .catch(error => {
        setRefreshing(false);
        toast.error(error);
      });
  };

  const handleLoadMore = () => {
    setLoading(true);
    const newOffset = offset + 10;
    api
      .getTransactions({limit: 10, offset: newOffset})
      .then(({transactions}) => {
        dispatch({type: 'addCommunityTransactions', payload: transactions});
        setOffset(newOffset);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast.error(error);
      });
  };

  return (
    <SafeAreaView forceInset={{top: 'always'}} style={{flex: 1}}>
      <SubHeader title="Community Ledger" navigation={navigation} />
      <View style={containers.screenContainer}>
        <View
          style={[
            styles.userInfoContainer,
            {borderBottomColor: colors.primaryColor},
          ]}>
          <Text style={styles.userInfoText}>RECENT TRANSACTIONS</Text>
        </View>
        <FlatList
          data={communityTransactions}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({item, index}) => (
            <>
              <TransactionItem
                id={item.id}
                timestamp={item.timestamp}
                value={item.value}
                locales={locales}
              />
              {index === communityTransactions.length - 1 && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    style={styles.button}>
                    {loading ? (
                      <ActivityIndicator
                        color={colors.primaryColor}
                        size="small"
                      />
                    ) : (
                      <Text>Load more transactions</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          keyExtractor={item => `transaction-${item.id}`}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: percentWidth(100),
    height: percentHeight(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: percentWidth(10),
    borderColor: colors.primaryColor,
    borderWidth: 1,
    height: percentWidth(10),
    width: percentWidth(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: percentHeight(10),
    width: percentWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    paddingVertical: percentHeight(2),
    marginBottom: percentHeight(2),
    justifyContent: 'flex-end',
    borderBottomWidth: 0.5,
  },
  userInfoText: {
    left: 17,
    opacity: 0.6,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
});
