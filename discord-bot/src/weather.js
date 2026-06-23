export default class Weather {
	static async search(query) {
		const secret = process.env.DISCORD_SECRET;
		const response = await fetch("https://juggalos.mercantec.tech/search/" + query, {
			headers: {
				"x-api-key": secret,
			}
		});

		if (!response.ok) return [];

		const jsonResponse = await response.json();

		return jsonResponse;
	}

	static async getForecast(latitude, longitude) {
		const secret = process.env.DISCORD_SECRET;
		const response = await fetch(`https://juggalos.mercantec.tech/forecast?latitude=${latitude}&longitude=${longitude}`, {
			headers: {
				"x-api-key": secret,
			}
		});

		if (!response.ok) return null;

		const jsonResponse = await response.json();

		return jsonResponse;
	}
}
