export default class Weather {
	static async getStations() {
		const response = await fetch("http://localhost/stations");

		if (!response.ok) return [];

		const jsonResponse = await response.json();

		return jsonResponse;
	}

	static async getForecast(stationId) {
		const response = await fetch(`http://localhost/forecast?stationId=${stationId}`);

		if (!response.ok) return null;

		const jsonResponse = await response.json();

		return jsonResponse;
	}
}
