# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running with Live Weather Data

This application can use the OpenWeatherMap API to provide real-time weather data. To enable this:

1.  **Get an API Key**: Sign up for a free account on [OpenWeatherMap](https://openweathermap.org/api) and get your API key.

2.  **Set up Environment Variable**: Create a file named `.env.local` in the root of your project and add your API key like this:

    ```
    OPENWEATHER_API_KEY=your_api_key_here
    ```

The application will automatically use this key to fetch live data. If the key is not provided, it will fall back to using mock data.
