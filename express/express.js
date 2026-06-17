import express from "express";

const app = express();
const port = 80;

app.get("/weather", async (req, res) => {
	// ?parameterId=temp_dry&period=latest&stationId=06180

	const id = req.query.stationId;

	if (!id) return res.status(400).send("Missing stationId query parameter");

	console.log(`Received request for stationId: ${id}`);

	const response = await fetch(`https://opendataapi.dmi.dk/v2/metObs/collections/observation/items?parameterId=temp_dry&period=latest&stationId=${id}`);

	if (!response.ok) return res.status(500).send({ error: "Error fetching weather data" });

	const jsonResponse = await response.json();

	res.status(200).send(jsonResponse);
});

app.get("/stations", async (req, res) => {
	const response = await fetch("https://opendataapi.dmi.dk/v2/climateData/collections/station/items");

	if (!response.ok) return res.status(500).send({ error: "Error fetching station data" });

	const jsonResponse = await response.json();

	const prettifiedResponse = jsonResponse.features
		.filter((station) => station.properties.country === "DNK")
		.map((station) => ({
			id: station.properties.stationId,
			name: station.properties.name,
		}));

	res.status(200).send(prettifiedResponse);
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
