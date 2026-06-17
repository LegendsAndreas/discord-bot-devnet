import express from "express";
import Weather from "./weather.js";
import { createClient } from "redis";

const client = createClient({
	socket: {
		host: "10.133.51.141",
		port: 6379,
	},
	password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => console.log("Redis Client Error", err));

const app = express();
const port = 80;

app.get("/forecast", async (req, res) => {
	const cachedForecast = await client.get(`forecast:${req.query.stationId}`);

	if (cachedForecast) return res.status(200).send(JSON.parse(cachedForecast));

	const forecast = await Weather.get10DayForecast(req.query.stationId);

	await client.set(`forecast:${req.query.stationId}`, JSON.stringify(forecast), { expiration: { type: "EX", value: 3600 } });

	res.status(200).send(forecast);
});

app.get("/stations", async (req, res) => res.status(200).send(await Weather.getStations()));

app.listen(port, () => console.log(`Example app listening on port ${port}`));

await client.connect();
