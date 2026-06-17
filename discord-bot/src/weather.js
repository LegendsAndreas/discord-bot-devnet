export default class Weather {
	static async getStations() {
		const response = await fetch("https://juggalos.mercantec.tech/stations");
		
		if (!response.ok) return [];
		
		const jsonResponse = await response.json();
		
		return jsonResponse;
	}

	static async getWeather(stationId) {
		const response = await fetch(`https://juggalos.mercantec.tech/weather?stationId=${stationId}`);

		if (!response.ok) return null;

		const jsonResponse = await response.json();

		return jsonResponse;
	}
}
