import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {getState} from 'app/lib/react-simply';
import {fonts, colors} from 'app/styles';
import Ethereum from 'app/lib/eth';
import {TransactionListItem} from 'app/components';
import * as api from 'app/lib/api';

export default function RecentTransactions({symbol}) {
  const [refreshing, setRefreshing] = useState(false);
  const [{transactions, user}, dispatch] = getState();

  const onRefresh = () => {
    setRefreshing(true);
    // api.getUserTransactions()
    //   .then((response) => {
    //     api.getPendingCharges()
    //       .then((pending) => {
    //         const payload = pending ? pending.concat(response) : response
    //         dispatch({ type: 'setTransactions', payload })
    //         setRefreshing(false)
    //       })
    //       .catch(() => {
    //         dispatch({ type: 'setTransactions', payload: response })
    //         setRefreshing(false)
    //       })
    //   })
    //   .catch((err) => {
    //     setRefreshing(false)
    //
    //   })
    Ethereum.create(user).then(eth => {
      eth
        .getBalance(symbol)
        .then(balance => {
          const payload = {};
          payload[`${symbol}Balance`] =
            Math.round((balance / 10 ** 6) * 100) / 100;
          dispatch({type: 'setUser', payload});
          setRefreshing(false);
        })
        .catch(err => {
          setRefreshing(false);
        });
    });
  };

  return (
    <FlatList
      data={transactions}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({item}) => (
        <TransactionListItem
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...item}
          userId={user.id}
        />
      )}
      keyExtractor={item => `transaction-${item.id}`}
      ListEmptyComponent={
        <View>
          <Text
            style={
              styles.emptyListText
            }>{`No recent ${symbol} transactions.`}</Text>
        </View>
      }
    />
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
  emptyListText2: {
    fontFamily: fonts.semiBold,
    color: colors.text,
    letterSpacing: -0.3,
    fontSize: 17,
    textAlign: 'center',
  },
});
