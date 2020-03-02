import React, { Component } from 'react';
import MeasurementsService from '../service/MeasurementsService';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import DatePicker from "react-datepicker";
import LineHandler from './LineHandler';
import Container from '../../node_modules/react-bootstrap/Container';
import Row from '../../node_modules/react-bootstrap/Row';
import Col from '../../node_modules/react-bootstrap/Col';
 
import "react-datepicker/dist/react-datepicker.css";


function chartData() {
  return {
    labels: [],
    datasets: []
  }
}

const options = {
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
scales: {
        yAxes: [{
            display: true,
            ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                // OR //
                //beginAtZero: true   // minimum value will be 0.
            }
        }]
    }
}

class GraphApp extends Component {

constructor(props) {
    super(props)
    this.state = {
      data: chartData(),
      fromDate: new Date(),
      toDate: new Date(),
      checkedStations: [],
      measurementValueType: 'MEAN',
      idCounter: 2,
      lines: [<LineHandler key={1} addLine={this.addLine.bind(this)} removeLine={this.removeLine.bind(this)} lineId={1}/>]
    }
    this.addLine = this.addLine.bind(this);
    this.generateNextId = this.generateNextId.bind(this);
    this.updateMeasurementValueType = this.updateMeasurementValueType.bind(this);
  }

  removeLine(lineIdToRemove) {
    this.setState({lines: this.state.lines.filter(function(line) { 
        return line.key != lineIdToRemove 
    })});
    let tempDataset = this.state.data.datasets.filter(
      function(line) {
        return line.lineId != lineIdToRemove
      }
    );
    let newDataset = this.state.data;
    newDataset.datasets = tempDataset;
    this.setState({data : newDataset});
    console.log(newDataset);
  }

  generateNextId() {
    let nextId = this.state.idCounter;
    this.setState({idCounter: nextId + 1});
    return nextId;
  }

  addLine(lineHandlerState) {
    var searchParameters ={
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      station: lineHandlerState.station,
      measurementTimePeriod: lineHandlerState.measurementTimePeriod,
      measurementValueType: lineHandlerState.measurementValueType
    }

    MeasurementsService.getForSingleLine(searchParameters).then(
      response => {
        var simplified =[]
        response.data.map(entry => simplified.push({date: entry.comment, temperatureValue: entry.temperatureValue, humidityValue:entry.humidityValue, valueType:entry.valueType, measurementTimestamp:entry.measurementTimestamp}));
        var labelValues = [];
        simplified.map(entry => labelValues.push(entry.measurementTimestamp));
        var tempData = [];
        simplified.map(entry => tempData.push(entry.temperatureValue));
        
        var tempDatasets = this.state.data.datasets;
        tempDatasets.push({
              lineId: lineHandlerState.lineId,
              label: 'it is working ' + lineHandlerState.measurementValueType + lineHandlerState.station,
              fillColor: 'rgba(111,111,111,0.2)',
                    strokeColor: 'rgba(111,111,111,1)',
                    pointColor: 'rgba(111,111,111,1)',
                    pointStrokeColor: '#666',
                    pointHighlightFill: '#666',
                    pointHighlightStroke: 'rgba(111,111,111,1)',
              data: tempData,
            });


        var obj = {
          labels: labelValues,
          datasets: tempDatasets
        }
        this.setState({data: obj});
        let tempLines = this.state.lines;
        let lineId = this.generateNextId();
        tempLines.push(<LineHandler key={lineId} addLine={this.addLine.bind(this)} removeLine={this.removeLine.bind(this)} lineId={lineId}/>);
        this.setState({lines: tempLines});
      }
    )
  }

  updateMeasurementValueType(e) {
    this.setState({measurementValueType:e.target.value});
  }

  onChange(e) {
    const options = this.state.options
    let index

    if (e.target.checked) {
      options.push(+e.target.value)
    } else {
      index = options.indexOf(+e.target.value)
      options.splice(index, 1)
    }

    this.setState({ options: options })
  }
  updateFromDate = date => {
    this.setState({
      fromDate: date
    });
  };

  updateToDate = date => {
    this.setState({
      toDate: date
    });
  };


	componentDidMount() {
	}

  render() {
    let periodPicker = <Row className="datePickerContainer"> 
                <Col lg={{span:1, offset: 2}} className="datePickerText">From:</Col>
                <Col lg={4}>
                  <DatePicker
                    selected={this.state.fromDate}
                    onChange={this.updateFromDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="dd MM yyyy h:mm aa"
                  />
                </Col>
                <Col lg={1} className="datePickerText">To:</Col>
                <Col lg={4}>
                  <DatePicker
                    selected={this.state.toDate}
                    onChange={this.updateToDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="dd MM yyyy h:mm aa"
                  />
                </Col>
              </Row>;
    return (
      <Container>
        <div class="sectionTitle">Historical data</div>
        <div class="graphContainer">
          {periodPicker}
          {this.state.lines.map(line => <div>{line}</div>)}
          <div>
            <Line data={this.state.data}
            options={options} width={600} height={250}/>	
          </div>     
        </div>
      </Container>
    )
  }


}



export default GraphApp