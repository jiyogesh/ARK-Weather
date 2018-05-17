import React, { Component } from 'react';
import ARKHeader from './Header';
import ARKFooter from './Footer';
import ARKWeatherInfo from './WeatherInfo';
import '../css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ARKHeader />
        <ARKWeatherInfo />
        <ARKFooter />
      </div>
    );
  }
}

export default App;
