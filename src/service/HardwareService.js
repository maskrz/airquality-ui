import axios from 'axios'

const HARDWARE_API_URL = 'http://localhost:8080/AirQuality/hardware/stations/getAll'

class HardwareService {
	getAllStations() {
		return axios.get(HARDWARE_API_URL);
	}
}

export default new HardwareService()