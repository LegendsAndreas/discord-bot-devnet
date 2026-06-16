import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 8080;

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/test', (req, res) => {
    res.send('Hello Pølse!')
})

app.get('/weather', async (req, res) => {
    // ?parameterId=temp_dry&period=latest&stationId=06180
    const id = req.query.stationId;
    if (!id) {
        res.status(400).send('Missing stationId query parameter');
        return;
    }

    console.log(`Received request for stationId: ${id}`);

    const url = `${process.env.API_CALL}?parameterId=temp_dry&period=latest&stationId=${id}`;
    await fetch(url).then(async (response) => {
        const jsonResponse = await response.json();
        res.send(jsonResponse);
    }).catch(error => {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

