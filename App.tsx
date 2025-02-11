/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './gesture-handler';

import React from 'react';

import { StatusBar } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';




const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
};

export default App;
