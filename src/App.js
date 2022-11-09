import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import Amplify from 'aws-amplify';
import {StateProvider} from 'app/lib/react-simply';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Loading from 'app/lib/loading';
import AppNavigator from './navigators/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import NavigationService from 'app/lib/NavigationService';
import {ApolloProvider} from 'react-apollo';
import makeApolloClient from 'app/lib/api/utils';
import amplify from 'app/aws-exports';
// import amplify from 'app/aws-exports';
console.disableYellowBox = true;
import state from 'app/state';
import reducer from 'app/reducers';

Amplify.configure(amplify);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

export default function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    makeApolloClient()
      .then(c => {
        setClient(c);
      })
      .catch(err => console.log('Error creating apollo client.', err)); // eslint-disable-line no-console

    SplashScreen.hide();
  }, []);

  return (
    <StateProvider initialState={state} reducer={reducer}>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Loading>
            <AppNavigator
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </Loading>
        </ApolloProvider>
      </SafeAreaProvider>
    </StateProvider>
  );
}
