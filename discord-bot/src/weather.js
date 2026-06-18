export default class Weather {
	static async search(query) {
		const response = await fetch("https://juggalos.mercantec.tech/search/" + query);

		if (!response.ok) return [];

		const jsonResponse = await response.json();

		return jsonResponse;
	}

	static async getForecast(latitude, longitude) {
		const response = await fetch(`https://juggalos.mercantec.tech/forecast?latitude=${latitude}&longitude=${longitude}`);

		if (!response.ok) return null;

		const jsonResponse = await response.json();

		return jsonResponse;
	}
}
