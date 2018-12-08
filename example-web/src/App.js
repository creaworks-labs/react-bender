import React, { Component } from 'react'
import { View, Text } from './components'

import { Bender } from 'react-bender'
import styles from './styles/index.bender'

export default class App extends Component {
  render () {
    console.log('styles', styles)
    return (
      <div>
        <Bender stylesheet={styles}>
          <View>
            <Text>Hello</Text>
          </View>
        </Bender>
      </div>
    )
  }
}
