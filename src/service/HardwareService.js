import axios from 'axios'

const HARDWARE_API_URL = 'http://localhost:8080/AirQuality/hardware/stations/getAll'
const HARDWARE_STATION_STATUS_API_URL = 'http://localhost:8080/AirQuality/hardware/stations/status/'

class HardwareService {
	getAllStations() {
		return axios.get(HARDWARE_API_URL);
	}
	getStatus(stationId) {
	    return axios.get(HARDWARE_STATION_STATUS_API_URL+ stationId)
	}
}

export default new HardwareService()