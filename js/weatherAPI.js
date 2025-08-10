const APIKey = 'e536c8530671f637b27de3f04b9e6674';

export async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            tempMax: Math.round(data.main.temp_max),
            tempMin: Math.round(data.main.temp_min),
            weather: data.weather[0].main,
            weatherDescription: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg, // Wind direction in degrees
            timezone: data.timezone, // Timezone offset in seconds
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
