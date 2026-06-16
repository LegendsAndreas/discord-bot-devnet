import express from "express";

const app = express();
const port = 80;

app.get("/weather", async (req, res) => {
	// ?parameterId=temp_dry&period=latest&stationId=06180

	const id = req.query.stationId;

	if (!id) {
		return res.status(400).send("Missing stationId query parameter");
	}

	console.log(`Received request for stationId: ${id}`);

	const url = `https://opendataapi.dmi.dk/v2/metObs/collections/observation/items?parameterId=temp_dry&period=latest&stationId=${id}`;

	await fetch(url)
		.then(async (response) => {
			const jsonResponse = await response.json();

			res.send(jsonResponse);
		})
		.catch((error) => {
			console.error("Error fetching weather data:", error);

			res.status(500).send("Error fetching weather data");
		});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
