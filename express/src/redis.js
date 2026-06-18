import { createClient } from "redis";

class Redis {
	constructor() {
		if (!process.env.REDIS_PASSWORD) {
			throw new Error("Missing REDIS_PASSWORD environment variable");
		}
		this.client = createClient({
			socket: {
				host: "10.133.51.141",
				port: 6379,
			},
			password: process.env.REDIS_PASSWORD,
		});

		this.client.on("error", (err) => console.log("Redis Client Error", err));

		this.connect();
	}

	async connect() {
		if (this.client.isOpen) return;

		await this.client.connect();
	}

	async getCachedForecast(latitude, longitude) {
		await this.connect();

		return await this.client.get(`forecast:${latitude}:${longitude}`);
	}

	async setCachedForecast(latitude, longitude, forecast) {
		await this.connect();

		await this.client.setEx(`forecast:${latitude}:${longitude}`, 300, JSON.stringify(forecast));
	}

	async getCachedSearch(query) {
		await this.connect();

		return await this.client.get(`search:${query}`);
	}

	async setCachedSearch(query, search) {
		await this.connect();

		await this.client.setEx(`search:${query}`, 86400, JSON.stringify(search));
	}
}

const redis = new Redis();

export default redis;
