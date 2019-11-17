/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';
import MainScreen from './src';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MainScreen/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;
