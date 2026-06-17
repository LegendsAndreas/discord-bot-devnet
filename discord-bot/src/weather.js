export default class Weather {
	static async getStations() {
		console.log("Getting stations...");

		const response = await fetch("https://juggalos.mercantec.tech/stations");

		if (!response.ok) return [];

		const jsonResponse = await response.json();

		return jsonResponse;
	}

	static async getForecast(stationId) {
		console.log("Getting forecast for station ID:", stationId);

		const response = await fetch(`https://juggalos.mercantec.tech/forecast?stationId=${stationId}`);

		if (!response.ok) return null;

		const jsonResponse = await response.json();

		return jsonResponse;
	}
}
