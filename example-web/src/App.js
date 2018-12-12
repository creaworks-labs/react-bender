import React, { Component } from 'react'
import { View, Text } from './components'

import { Bender } from 'react-bender'
import styles from './styles'

export default class App extends Component {
  render () {
    console.log('styles', styles)
    return (
      <div>
        <Bender stylesheet={styles}>
          <View flexible>
            <Text>Hello</Text>
          </View>
        </Bender>
      </div>
    )
  }
}
