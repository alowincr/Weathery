# Weathery: A Modern Weather Application

This is a feature-rich weather application built with Next.js, TypeScript, and Tailwind CSS in Firebase Studio. It provides real-time weather data, forecasts, and a dynamic, user-friendly interface with smooth animations.

## ✨ Features

-   **Real-Time Weather Data**: Get current weather information for any city worldwide using the OpenWeatherMap API.
-   **Detailed Information**: Displays temperature, weather description, humidity, wind speed, cloudiness, pressure, visibility, and local time.
-   **5-Day Forecast**: Shows the expected maximum and minimum temperatures for the next five days with animated weather icons.
-   **Hourly Forecast**: An interactive chart displaying the temperature trend for the next 24 hours.
-   **Geolocation**: Instantly get the weather for your current location with a single click.
-   **Dynamic Day/Night Theme**: The application's color scheme and background gradient change automatically based on whether it's daytime or nighttime in the selected city.
-   **Smart Search**: Features autocompletion to provide city suggestions as you type.
-   **City & Country Discovery**: Explore the weather in popular cities and countries through dedicated sections in the sidebar.
-   **Search History**: Remembers your last 5 searches for quick access.
-   **Responsive Design**: A beautiful and functional UI that works seamlessly on desktop, tablets, and mobile devices.
-   **Secure API Key Handling**: All API requests are handled on the server-side, ensuring your API key is never exposed to the client.
-   **Polished Animations**: Smooth transitions and animations powered by GSAP and Tailwind CSS make the user experience more engaging.

## 🛠️ Tech Stack

-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: ShadCN/UI
-   **Animations**: GSAP
-   **AI**: Genkit (Available for future AI features)
-   **Data Fetching**: OpenWeatherMap API

## 🚀 Getting Started

To run this project with live weather data, you'll need an API key from OpenWeatherMap.

1.  **Get an API Key**: Sign up for a free account on [OpenWeatherMap](https://openweathermap.org/api) and get your API key. Note that new API keys can take a couple of hours to become active.

2.  **Set up Environment Variable**: Create a file named `.env.local` in the root of your project and add your API key like this:

    ```
    OPENWEATHER_API_KEY=your_api_key_here
    ```

3.  **Run the application**:
    ```bash
    npm install
    npm run dev
    ```

The application will automatically use this key to fetch live data. If the key is not provided, it will fall back to using mock data.

## 🔒 Security & Publishing

It is **safe** to publish this project to a public GitHub repository. Your OpenWeatherMap API key is secure because:

1.  **`.gitignore` File**: This project includes a `.gitignore` file, which explicitly tells Git to **ignore** sensitive files like `.env.local`. This prevents your API key from ever being uploaded to GitHub.
2.  **Server-Side Logic**: All API calls are made from the server using Next.js Server Actions. Your API key is never exposed to the user's browser.

### Deploying to the Web

When you deploy your application to a hosting provider (like Vercel, Netlify, or Firebase App Hosting), you will need to set your API key as an **environment variable** in your hosting provider's settings dashboard.

1.  Go to your project's settings on your hosting platform.
2.  Find the section for "Environment Variables".
3.  Add a new variable with the following name and value:
    *   **Name**: `OPENWEATHER_API_KEY`
    *   **Value**: `your_api_key_here`

The deployed application will then use this key to fetch live weather data.
