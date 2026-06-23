import express from "express";
import Weather from "./weather.js";
import redis from "./redis.js";

const app = express();
const port = 80;

app.use((req, res, next) => {
	const secret = process.env.DISCORD_SECRET;
	if (!secret) {
		throw new Error("DISCORD_SECRET environment variable is not set");
	}
	const ip = req.ip || req.connection.remoteAddress;
	console.log(`Incoming request from ${ip} to ${req.path}`);
	
    const isLocalhost =
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip === "::ffff:127.0.0.1";

    const isPrivateNetwork =
        ip.startsWith("::ffff:10.") ||
        ip.startsWith("::ffff:192.168.") ||
        ip.startsWith("::ffff:172.");

	if (!isLocalhost && !isPrivateNetwork) {
		return res.status(403).json({ error: "Unauthorized ip address" });
	}

	if (req.headers["x-api-key"] !== secret) {
		return res.status(403).json({ error: "Unauthorized" });
	}

	next();
});

app.get("/forecast", async (req, res) => {
	const latitude = Number(req.query.latitude);
	const longitude = Number(req.query.longitude);

	if (!latitude || !longitude) return res.status(400).send({ error: "Missing latitude or longitude query parameters" });

	const cachedForecast = await redis.getCachedForecast(latitude, longitude);

	if (cachedForecast) return res.status(200).send(JSON.parse(cachedForecast));

	const forecast = await Weather.getForecastByCoordinates(latitude, longitude);

	if (!forecast) return res.status(404).send({ error: "Could not find forecast for those coordinates" });

	await redis.setCachedForecast(latitude, longitude, forecast);

	res.status(200).send(forecast);
});

app.get("/search/:query", async (req, res) => {
	const cachedSearch = await redis.getCachedSearch(req.params.query);

	if (cachedSearch) return res.status(200).send(JSON.parse(cachedSearch));

	const search = await Weather.search(req.params.query);

	await redis.setCachedSearch(req.params.query, search);

	res.status(200).send(search);
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
