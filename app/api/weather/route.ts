import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  description: string;
  condition: string;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  cloudiness: number;
  uvIndex?: number;
  precipitation?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '40.7128'; // Default: NYC
    const lon = searchParams.get('lon') || '-74.0060';
    const units = searchParams.get('units') || 'metric';

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenWeather API key not configured' },
        { status: 500 }
      );
    }

    // Fetch current weather
    const weatherResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`OpenWeather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // Fetch UV index
    const uvResponse = await fetch(
      `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    const uvData = uvResponse.ok ? await uvResponse.json() : { value: 0 };

    const processedData: WeatherData = {
      temp: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 10) / 10,
      pressure: weatherData.main.pressure,
      visibility: Math.round(weatherData.visibility / 1000),
      description: weatherData.weather[0].description,
      condition: weatherData.weather[0].main,
      feelsLike: Math.round(weatherData.main.feels_like),
      tempMin: Math.round(weatherData.main.temp_min),
      tempMax: Math.round(weatherData.main.temp_max),
      cloudiness: weatherData.clouds.all,
      uvIndex: Math.round(uvData.value * 10) / 10,
      precipitation: weatherData.rain?.['1h'] || 0,
    };

    return NextResponse.json(processedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
