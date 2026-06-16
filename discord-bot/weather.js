class Weather {
    constructor(apiKey) {
        this.apiKey = apiKey;

        this.stations = {
            aarhus: {
                name: "Aarhus",
                id: "06070"
            },
            kbh: {
                name: "København",
                id: "06180"
            }
        };
    }

   async getWeather(citykey) {
        const city = this.stations[citykey];

        if(!city){
            throw new Error("city not supported");
        }

        const url = `https://dmigw.govcloud.dk/v2/metObs/collections/observation/items?stationId=${city.id}&parameterId=temp_dry&limit=1`;

        const res = await fetch(url,{headers: {
            "X-Gravitee-Api-Key": this.apiKey
        }})

        const data = await res.json();

         if (!data.features || data.features.length === 0) {
            throw new Error("No data found");
        }
        const obs = data.features[0];

        return{
            city: city.name,
            temperature: obs.properties.value,
            time: obs.properties.observed
        }
    }
}
export default Weather;