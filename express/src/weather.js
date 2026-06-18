export default class Weather {
	static async getForecastByCoordinates(latitude, longitude) {
		const response = await fetch(`https://www.dmi.dk/NinJo2DmiDk/ninjo2dmidk?cmd=llj&lat=${latitude}&lon=${longitude}`);

		if (!response.ok) return null;

		const data = await response.json();

		return await this.buildForecast(data);
	}

	static async buildForecast(data) {
		const search = await this.searchById(data.id);

		const sunrise = this.parseSunTime(data.sunrise);
		const sunset = this.parseSunTime(data.sunset);

		const now = data.timeserie[0];

		const current = {
			temperature: Math.round(now.temp),
			condition: this.symbolToEmoji(now.symbol),

			humidity: Math.round(now.humidity),

			wind: {
				speed: Number(now.windSpeed.toFixed(1)),
				direction: now.windDir,
			},

			pressure: Math.round(now.pressure),

			sunrise,
			sunset,
		};

		const hourly = data.timeserie.slice(0, 24).map((item) => {
			const date = new Date(item.localTimeIso);

			const hours = date.getHours();

			const isSunset = hours === sunset.hour && Math.abs(date.getMinutes() - sunset.minute) <= 30;

			const isSunrise = hours === sunrise.hour && Math.abs(date.getMinutes() - sunrise.minute) <= 30;

			return {
				time: this.parseSunTime(hours.toString().padStart(2, "0") + date.getMinutes().toString().padStart(2, "0")),

				temp: Math.round(item.temp),

				condition: this.symbolToEmoji(item.symbol),

				precipitationChance: item.precip1,

				windSpeed: Number(item.windSpeed.toFixed(1)),

				isSunrise,
				isSunset,
			};
		});

		const daily = data.aggData.map((day) => {
			const date = new Date(`${day.time.slice(0, 4)}-${day.time.slice(4, 6)}-${day.time.slice(6, 8)}`);

			const symbolEntry = data.twelveHourSymbols.find((s) => s.time.startsWith(day.time));

			const weekDay = date.toLocaleDateString("da-DK", { weekday: "long" });

			return {
				date: weekDay.charAt(0).toUpperCase() + weekDay.slice(1),

				minTemp: day.minTemp,
				maxTemp: day.maxTemp,

				avgTemp: day.meanTemp,

				precipitation: Number(day.precipSum.toFixed(1)),

				uvIndex: day.uvRadiation,

				condition: this.symbolToEmoji(symbolEntry?.symbol12 || 3),
			};
		});

		return {
			...search,
			current,
			hourly,
			daily,
		};
	}

	static async search(query, limit = 25) {
		const searchParams = new URLSearchParams({
			q: `(name:"${query}" AND realm:1)^4 OR (name_ngram:"${query}" AND realm:1)`,
			rows: limit,
			wt: "json",
		});

		const response = await fetch(`https://www.dmi.dk/solr/city_core/select?${searchParams}`);

		if (!response.ok) return [];

		const text = await response.text();

		const data = JSON.parse(text);

		return data.response.docs
			.filter((doc) => doc.countryname === "Danmark" && doc.latitude && doc.longitude)
			.map((doc) => ({
				id: doc.id,
				city: doc.name_ngram,
				municipality: doc.municipality,
				region: doc.region?.[0],
				latitude: doc.latitude?.[0],
				longitude: doc.longitude?.[0],
			}));
	}

	static async searchById(id) {
		const searchParams = new URLSearchParams({
			q: `(id:"${id}" AND realm:1)^4`,
			rows: 1,
			wt: "json",
		});

		const response = await fetch(`https://www.dmi.dk/solr/city_core/select?${searchParams}`);

		if (!response.ok) return null;

		const text = await response.text();

		const data = JSON.parse(text);

		return data.response.docs
			.filter((doc) => doc.countryname === "Danmark")
			.map((doc) => ({
				id: doc.id,
				city: doc.name_ngram,
				municipality: doc.municipality,
				region: doc.region[0],
				latitude: doc.latitude[0],
				longitude: doc.longitude[0],
			}))?.[0];
	}

	static parseSunTime(hhmm) {
		const now = new Date();

		const hour = parseInt(hhmm.slice(0, 2));
		const minute = parseInt(hhmm.slice(2, 4));

		now.setHours(hour, minute, 0, 0);

		return Math.floor(now.getTime() / 1000);
	}

	static symbolToEmoji(symbol) {
		const map = {
			// Day
			1: "☀️", // Clear
			2: "🌤️", // Partly cloudy
			3: "☁️", // Cloudy

			// Night
			101: "🌙", // Clear night
			102: "🌙☁️", // Partly cloudy night
			103: "☁️🌙", // Cloudy night

			// Rain
			60: "🌧️",
			80: "🌦️",
			160: "🌧️",
			180: "⛈️",
			181: "⛈️⚡",
		};

		return map[symbol] || "❓";
	}
}
