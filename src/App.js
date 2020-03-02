import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MeasurementsApp from './component/MeasurementsApp'
import GraphApp from './component/GraphApp'

class App extends Component {
	render() {
		return (
			<div class="main"> 
				<div class="header">Household status</div>
				<div class="section"><MeasurementsApp /> </div>
				<div class="section"><GraphApp/></div>
			</div>
			
		)
	}
}

export default App;
