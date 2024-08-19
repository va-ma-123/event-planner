import axios from 'axios';
import moment from 'moment';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface WeatherForecast {
    datetime: string;
    temp: number;
    high_temp: number;
    low_temp: number;
    weather: {
        description: string;
    }
    wind_spd: number;
    precip: number;
}

async function getCoordinates( location: string ): Promise<Coordinates> {
    try {
        const api_url = 'https://api.opencagedata.com/geocode/v1/json';
        const request_url = `${api_url}?q=${location}&key=${process.env.OPENCAGE_GEOCODING_API_KEY}`;
        const response = await axios.get(request_url);

        if(response.data.results.length === 0){
            console.log('Location not found');
            throw new Error("Location not found");
        }
        const {lat, lng} = response.data.results[0].geometry;
        return { latitude: lat, longitude: lng };
    } catch(err) {
        console.error('Error fetching coordinates: ', err);
        throw new Error("Failed to fetch coordinates");
    }
};

export default async function getWeatherForecast( date: string, location: string): Promise<WeatherForecast | null> {
    try{
        const {latitude, longitude} = await getCoordinates(location);
        console.log(`Coordinates: (${latitude}, ${longitude})`);
        const numDays = 7;
        const api_url = 'http://api.weatherbit.io/v2.0/forecast/daily';
        const request_url = `${api_url}?key=${process.env.WEATHERBIT_API_KEY}&lat=${latitude}&lon=${longitude}&days=${numDays}`;
        const response = await axios.get(request_url);
        const forecasts: WeatherForecast[] = response.data.data;

        const requiredForecast = forecasts.find( forecast => 
            moment(forecast.datetime).isSame(date, 'day')
        )

        if(!requiredForecast) {
            console.log("No forecast available for this date.");
            return null;    
        }
        return requiredForecast;
    } catch(err) {
        console.error('Error fetching forecast: ', err);
        throw new Error("Failed to fetch forecast");
    }
};
