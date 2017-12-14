import React, { Component } from 'react';
import Toolbar from './components/Toolbar';
import Nav from './components/Nav';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Toolbar />
      </div>
    );
  }
}

export default App;
