import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HardwareService from '../service/HardwareService';
import Container from '../../node_modules/react-bootstrap/Container';
import Row from '../../node_modules/react-bootstrap/Row';
import Col from '../../node_modules/react-bootstrap/Col';
import Button from '../../node_modules/react-bootstrap/Button';
import Dropdown from '../../node_modules/react-bootstrap/Dropdown';

class LineHandler extends Component {

constructor(props) {
    super(props)
    this.state = {
      measurementTimePeriod: 'HOURLY',
      measurementValueType: 'MEAN',
      station: '',
      stations: [],
      addButton: true,
      lineId: props.lineId,
      measurementTimePeriodDisplayValue: 'Godzinowa',
      measurementValueTypeDisplayValue: 'Srednia',
      stationDisplayValue:''
    }
    this.updateMeasurementValueType = this.updateMeasurementValueType.bind(this);
    this.updateMeasurementTimePeriod = this.updateMeasurementTimePeriod.bind(this);
    this.updateStation = this.updateStation.bind(this);
    this.addLine = this.addLine.bind(this);
    this.removeLine = this.removeLine.bind(this);
  }

  updateMeasurementValueType(e) {
    this.setState({measurementValueType:e});
  }

  updateMeasurementTimePeriod(e) {
    this.setState({measurementTimePeriod:e});
  }

  updateStation(e) {
    this.setState({station:e});
  }

  addLine(e) {
    this.setState({addButton: false});
    this.props.addLine(this.state);
  }

  removeLine(e) {
    this.props.removeLine(this.state.lineId);
  }

	componentDidMount() {
    loadStations(this);

	}

  render() {
    let button;
    if (this.state.addButton) {
      button = <Button onClick={this.addLine} variant="success">Draw Line</Button>;
    } else {
      button = <Button onClick={this.removeLine} variant="danger">Remove Line</Button>;
    }
    return (
      <Container>
        <Row className="lineHandlerRow"> 
          <Col lg={{span:2, offset:2}}>
            <Dropdown onSelect={this.updateMeasurementTimePeriod}>
              <Dropdown.Toggle variant="info">
                {this.state.measurementTimePeriodDisplayValue}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="HOURLY" onSelect={(e) => this.setState({measurementTimePeriodDisplayValue:"Godzinowa"})}>Godzinowa</Dropdown.Item>
                <Dropdown.Item eventKey="NIGHTLY" onSelect={(e) => this.setState({measurementTimePeriodDisplayValue:"Nocna"})}>Nocna</Dropdown.Item>
                <Dropdown.Item eventKey="DAILY" onSelect={(e) => this.setState({measurementTimePeriodDisplayValue:"Dzienna"})}>Dzienna</Dropdown.Item>
                <Dropdown.Item eventKey="DAILY_24H" onSelect={(e) => this.setState({measurementTimePeriodDisplayValue:"Dobowa"})}>Dobowa</Dropdown.Item>
              </Dropdown.Menu>  
            </Dropdown>
          </Col>
          <Col lg={2}> 
            <Dropdown onSelect={this.updateMeasurementValueType}>
              <Dropdown.Toggle variant="info">
                {this.state.measurementValueTypeDisplayValue}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="MIN" onSelect={(e) => this.setState({measurementValueTypeDisplayValue:"Minimalna"})}>Minimalna</Dropdown.Item>
                <Dropdown.Item eventKey="MAX" onSelect={(e) => this.setState({measurementValueTypeDisplayValue:"Maksymalna"})}>Maksymalna</Dropdown.Item>
                <Dropdown.Item eventKey="MEAN" onSelect={(e) => this.setState({measurementValueTypeDisplayValue:"Srednia"})}>Srednia</Dropdown.Item>
              </Dropdown.Menu>  
            </Dropdown>
          </Col>
          <Col lg={2}>
            <Dropdown onSelect={this.updateStation}>
              <Dropdown.Toggle variant="info">
                {this.state.stationDisplayValue}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {this.state.stations.map(item => (
                  <Dropdown.Item eventKey={item.id} onSelect={(e) => this.setState({stationDisplayValue:item.name})}>{item.name}</Dropdown.Item>
                    
                  ))
                  }
              </Dropdown.Menu>  
            </Dropdown>
          </Col>
          <Col lg={2}>
            {button}
          </Col>
        </Row>
      </Container>
    )
  }
}

function loadStations(self) {
    HardwareService.getAllStations().then(
      response => {
        var results=[];
        response.data.map(entry => results.push({id:entry.id+'', name:entry.name} ));
        self.setState({stations: results});
        self.setState({station: results[0].id});
        self.setState({stationDisplayValue: results[0].name});
      }
    )
}




export default LineHandler