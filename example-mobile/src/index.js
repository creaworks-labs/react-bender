import React from 'react';
import { StyleSheet } from 'react-native';
import { withBenderStyles, Bender } from 'react-bender';

import { Text, View } from './components';

import stylesheet from './styles'

console.log('HERE', stylesheet)

export default class App extends React.Component {
  render() {
    return (
      <Bender stylesheet={stylesheet}>
        <React.Fragment>
          <View liquid styleName="vertical v-center h-center">
            <Text styleName="bold">Open up App.js to start working on your app!</Text>
            <Text styleName="italic">This is italic text</Text>
            <Text styleName="">This is <Text styleName="line-through">nested</Text> italic text</Text>
          </View>

          <View styleName="flexible horizontal">
            <View styleName="flexible stretch" style={{backgroundColor:'green'}}>

            </View>

            <View styleName="flexible stretch" style={{backgroundColor:'yellow'}}>

            </View>
          </View>
        </React.Fragment>
      </Bender>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
