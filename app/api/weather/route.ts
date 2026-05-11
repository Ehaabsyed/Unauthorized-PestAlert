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

    // Access env key directly inside handler for freshness after restart
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'PLACEHOLDER' || apiKey === 'f6d61361b1d7ddaecf69d6f93136f097_REPLACE_ME') {
      console.warn('[Weather API] API key is missing or using placeholder');
      return NextResponse.json(
        { 
          error: 'OpenWeather API key not configured',
          isPlaceholder: true 
        },
        { status: 500 }
      );
    }

    // Fetch current weather
    const weatherResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`,
      { cache: 'no-store' }
    );

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error(`[Weather API] OpenWeather error (${weatherResponse.status}):`, errorText);
      throw new Error(`OpenWeather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // UV API endpoint: OpenWeather 2.5 /uvi is deprecated, One Call 3.0 is preferred 
    // but often 2.5 keys don't work with One Call. 
    // We'll try to get it, but it's optional.
    let uvIndex = 0;
    try {
      // Try to fetch UV index if available (2.5 endpoint)
      const uvResponse = await fetch(
        `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = uvData.value ?? 0;
      }
    } catch (e) {
      console.warn('[Weather API] UV index fetch failed');
    }

    const processedData: WeatherData = {
      temp: weatherData.main?.temp != null ? Math.round(weatherData.main.temp) : 0,
      humidity: weatherData.main?.humidity ?? 0,
      windSpeed: weatherData.wind?.speed != null ? Math.round(weatherData.wind.speed * 10) / 10 : 0,
      pressure: weatherData.main?.pressure ?? 'N/A',
      visibility: weatherData.visibility != null ? Math.round(weatherData.visibility / 1000) : 0,
      description: weatherData.weather?.[0]?.description ?? 'No description available',
      condition: weatherData.weather?.[0]?.main ?? 'Unknown',
      feelsLike: weatherData.main?.feels_like != null ? Math.round(weatherData.main.feels_like) : 0,
      tempMin: weatherData.main?.temp_min != null ? Math.round(weatherData.main.temp_min) : 0,
      tempMax: weatherData.main?.temp_max != null ? Math.round(weatherData.main.temp_max) : 0,
      cloudiness: weatherData.clouds?.all ?? 'N/A',
      uvIndex: Math.round(uvIndex * 10) / 10,
      precipitation: weatherData.rain?.['1h'] ?? 0,
    };

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error('[Weather API Internal] Failure:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', message: error.message },
      { status: 500 }
    );
  }
}
