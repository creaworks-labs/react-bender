import React, { Component } from 'react'
import { View, Text } from './components'

import { Bender } from 'react-bender'

import stylesheet from './styles'

export default class App extends Component {
  render () {
    console.log('styles', stylesheet)
    return (
      <Bender stylesheet={stylesheet}>
        <React.Fragment>
          <View styleName="flexible vertical v-center h-center">
            <Text styleName="bold">Open up App.js to start working on your app!</Text>
            <Text styleName="italic">This is italic text</Text>
            <Text styleName="italic">This is <Text styleName="line-through">nested</Text> italic text</Text>
          </View>

          <View styleName="flexible horizontal">
            <View styleName="flexible stretch" style={{backgroundColor:'green'}}>

            </View>

            <View styleName="flexible stretch" style={{backgroundColor:'yellow'}}>

            </View>
          </View>
        </React.Fragment>
      </Bender>
    )
  }
}
