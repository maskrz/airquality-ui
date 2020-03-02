import React, { Component } from 'react';
import MeasurementsService from '../service/MeasurementsService';
import HardwareService from '../service/HardwareService';
import Container from '../../node_modules/react-bootstrap/Container';
import Row from '../../node_modules/react-bootstrap/Row';
import Col from '../../node_modules/react-bootstrap/Col';
import ProgressBar from '../../node_modules/react-bootstrap/ProgressBar';

class MeasurementsApp extends Component {

	constructor(props) {
		super(props)
		this.state= {
			measurements: [],
			temperature: null,
			humidity: null
		}
		this.getCurrent = this.getCurrent.bind(this);
		this.getTemperatureCss = this.getTemperatureCss.bind(this);
		this.getCurrentForStation = this.getCurrentForStation.bind(this);
	}

	componentDidMount() {
		this.getCurrent();
		this.interval = setInterval(() => this.getCurrent(), 10000);
	}


	componentWillUnmount() {
		clearInterval(this.interval);
	}

	getCurrent() {
	    HardwareService.getAllStations().then(
	      response => {

	      	response.data.map(entry => {
	      		let current = Object.assign([], this.state.measurements);
	      		if (current[entry.id] == undefined) {
					current[entry.id] = {station: entry, measurement: {}};
				} else {
					current[entry.id] = {station: entry, measurement: current[entry.id].measurement};
				}
				this.setState({measurements : current});
				this.getCurrentForStation(entry);
				});
	      }
	    )
	}

	getCurrentForStation(entry) {
		var res = null;
		MeasurementsService.getCurrent(entry.id).then(
			response => {
	      		let currentMeasurements = Object.assign([], this.state.measurements);
				currentMeasurements[entry.id] = {station: currentMeasurements[entry.id].station, measurement: response.data};
				this.setState({measurements : currentMeasurements});
			}
		)
	}

	getCurrentTemp() {
		MeasurementsService.getCurrent().then(
			response => {
				this.setState({
					temperature: response.data.temperatureValue,
					humidity: response.data.humidityValue
				})
			}
		)
	}

	getTemperatureCss(tempValue) {
		if (tempValue < -10) {
			return "-sm10";
		}
		if (tempValue < 0) {
			return "-s0";
		}
		if (tempValue < 10) {
			return "-s10";
		}
		if (tempValue < 15) {
			return "-s15";
		}
		if (tempValue < 20) {
			return "-s20";
		}
		if (tempValue < 25) {
			return "-s25";
		}
		if (tempValue < 30) {
			return "-s30";
		}
		if (tempValue < 35) {
			return "-s35";
		}
		return "-o35";
	}

	render() {
		return (
			<div>
				<div class="sectionTitle">Current measurements</div>
				<Container>
	          		{this.state.measurements.map(value => 
	          			<Row className="stationRow">
	          				<Col lg={2} className="stationName">{value.station.name}</Col> 
	          				<Col lg={1} >Temp.:</Col> 
	          				<Col lg={4} >
	          					<ProgressBar className={"temperatureProgressBar temperatureProgressBar"+this.getTemperatureCss(value.measurement.temperatureValue)} now={value.measurement.temperatureValue} max={value.measurement.temperatureValue} label={`${value.measurement.temperatureValue}`}/>
	          				</Col>
	          				<Col lg={1} >Humidity:</Col> 
	          				<Col lg={4} >
	          					<ProgressBar className="humidityProgressBar" now={value.measurement.humidityValue} variant="info" label={`${value.measurement.humidityValue}%`}/>
	          				</Col>
	          			</Row>
	          		)}
          		</Container>
			</div>
		)
	}
}

export default MeasurementsApp