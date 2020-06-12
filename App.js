import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar, Platform,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen'
import NetInfo from "@react-native-community/netinfo";

//Router
import Router from './src/Router';

import store from './src/store/index';

import {Provider} from 'mobx-react';

import NavigationService from './src/NavigationService';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Spinner from 'react-native-loading-spinner-overlay';

const App: () => React$Node = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        SplashScreen.hide();
        const unsubscribe = NetInfo.addEventListener(state => {
            if(state.isConnected == false) {
                Snackbar.show({
                    text: 'İnternet bağlantınız yok',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: '#aacfcf',
                    textColor: 'white',
                });
            }

            setLoading(!state.isConnected)
        });

    }, []);

  return (
    <Provider {...store}>
        <SafeAreaProvider>
            <Spinner
                visible={loading}
                animation={'fade'}
                size={'small'}
            />
      <Router
          ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
          }}
      />
        </SafeAreaProvider>
    </Provider>
  );
};







const styles = StyleSheet.create({

});

export default App;
