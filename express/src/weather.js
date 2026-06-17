export default class Weather {
	static async get10DayForecast(stationId) {
		const station = await this.getStation(stationId);

		const forecast = await this.getForecast(station.lat, station.lon);

		if (!forecast) return null;

		return this.build10DayForecast(forecast);
	}

	static async getStation(stationId) {
		const response = await fetch(`https://opendataapi.dmi.dk/v2/metObs/collections/station/items?stationId=${stationId}`);

		if (!response.ok) return null;

		const data = await response.json();

		if (!data?.features || data.features.length === 0) return null;

		const feature = data.features[0];

		const [lon, lat] = feature.geometry.coordinates;

		return { id: feature.properties.stationId, name: feature.properties.name, lat, lon };
	}

	static async getStations() {
		const response = await fetch(`https://opendataapi.dmi.dk/v2/metObs/collections/station/items`);

		if (!response.ok) return [];

		const data = await response.json();

		return data.features
			.filter((f) => f.properties.country === "DNK")
			.map((f) => {
				const [lon, lat] = f.geometry.coordinates;

				return { id: f.properties.stationId, name: f.properties.name, lat, lon };
			})
			.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
	}

	static async getForecast(lat, lon) {
		const params = new URLSearchParams({
			coords: `POINT(${lon} ${lat})`,
			crs: "crs84",
			"parameter-name": "temperature-2m,total-precipitation",
		});

		const response = await fetch(`https://opendataapi.dmi.dk/v1/forecastedr/collections/harmonie_dini_eps_means/position?${params}`);

		if (!response.ok) return null;

		return response.json();
	}

	static build10DayForecast(coverage) {
		const t = coverage.domain.axes.t.values;

		const temp = coverage.ranges["temperature-2m"].values;
		const rain = coverage.ranges["total-precipitation"].values;

		const days = {};

		for (let i = 0; i < t.length; i++) {
			const date = t[i].slice(0, 10);

			const tempC = temp[i] - 273.15;
			const rainVal = rain[i] ?? 0;

			if (!days[date]) {
				days[date] = {
					minTemp: tempC,
					maxTemp: tempC,
					rainStart: rainVal,
					rainEnd: rainVal,
					rainHours: 0,
					totalHours: 0,
				};
			}

			const d = days[date];

			d.minTemp = Math.min(d.minTemp, tempC);
			d.maxTemp = Math.max(d.maxTemp, tempC);

			d.totalHours++;

			if (rainVal > 0.05) d.rainHours++;

			d.rainEnd = rainVal;
		}

		let result = Object.entries(days).map(([date, d]) => {
			const mm = Math.max(0, d.rainEnd - d.rainStart);

			const rainChance = Math.round((d.rainHours / d.totalHours) * 100);

			return {
				date,
				minTemp: Number(d.minTemp.toFixed(1)),
				maxTemp: Number(d.maxTemp.toFixed(1)),
				rainMm: Number(mm.toFixed(1)),
				rainChance,
			};
		});

		result.sort((a, b) => a.date.localeCompare(b.date));

		while (result.length < 10) {
			const last = result[result.length - 1];

			const d = new Date(last.date);

			d.setDate(d.getDate() + 1);

			result.push({
				date: d.toISOString().slice(0, 10),
				minTemp: last.minTemp,
				maxTemp: last.maxTemp,
				rainMm: 0,
				rainChance: 0,
			});
		}

		return result.slice(0, 10);
	}
}
