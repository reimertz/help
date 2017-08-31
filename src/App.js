import React, { Component } from 'react'
import './App.css'

import MyEditor from './containers/MyEditor'

import Description from './components/Description'

class App extends Component {
  render() {
    return (
      <main>
        <h1> IdeaPad Challenge</h1>
        <MyEditor />
        <Description />
      </main>
    )
  }
}

export default App
