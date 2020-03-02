import axios from 'axios'

const MEASUREMENTS_API_URL_CURRENT = 'http://localhost:8080/AirQuality/measurements/getCurrent/'
const MEASUREMENTS_API_URL2 = 'http://192.168.1.13:8080/airquality/measurements/yesterdayData'
const MEASUREMENTS_API_LAST24INDOOR = 'http://192.168.1.13:8080/airquality/measurements/last24Indoor'
const MEASUREMENTS_API_LAST24OUTDOOR = 'http://192.168.1.13:8080/airquality/measurements/last24Outdoor'
const MEASUREMENTS_API_CUSTOM = 'http://localhost:8080/AirQuality/measurements/getCustom'
const MEASUREMENTS_API_SINGLE_LINE = 'http://localhost:8080/AirQuality/measurements/getForSingleLine'

class MeasurementsService {
	getCurrent(stationId) {
		return axios.get(MEASUREMENTS_API_URL_CURRENT+stationId);
	}
	yesterdayData() {
		return axios.get(MEASUREMENTS_API_URL2);
	}
	last24Indoor() {
		return axios.get(MEASUREMENTS_API_LAST24INDOOR);
	}
	last24Outdoor() {
		return axios.get(MEASUREMENTS_API_LAST24OUTDOOR);
	}
	getCustom(searchParameters) {
		return axios.post(MEASUREMENTS_API_CUSTOM, searchParameters);
	}
	getForSingleLine(searchParameters) {
		return axios.post(MEASUREMENTS_API_SINGLE_LINE, searchParameters);
	}
}

export default new MeasurementsService()