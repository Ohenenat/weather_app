/**
 * Weather Application
 * A fully functional weather app with dynamic themes, hourly forecasts, and rain sound effects
 * Uses OpenWeatherMap API for weather data
 */

// ============ CONFIGURATION ============
const CONFIG = {
    // Get a free API key from: https://openweathermap.org/api
    API_KEY: 'e83d90f370f2efb94b0d1d2c0533b39a', // Replace with your actual OpenWeatherMap API key
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_CITY: 'London',
    LOCAL_STORAGE_KEYS: {
        LAST_CITY: 'weather_last_city',
        UNITS: 'weather_units',
        SOUND_ENABLED: 'weather_sound_enabled'
    }
};

// ============ DOM ELEMENTS ============
const DOM = {
    // Header
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    unitsToggle: document.getElementById('unitsToggle'),
    soundToggle: document.getElementById('soundToggle'),

    // Loading & Error
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),

    // Weather Display
    currentTemp: document.getElementById('currentTemp'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherCondition: document.getElementById('weatherCondition'),
    locationName: document.getElementById('locationName'),
    humidity: document.getElementById('humidity'),
    pressure: document.getElementById('pressure'),
    windSpeed: document.getElementById('windSpeed'),
    feelsLike: document.getElementById('feelsLike'),

    // Forecasts
    hourlyForecast: document.getElementById('hourlyForecast'),
    extendedForecast: document.getElementById('extendedForecast'),

    // Audio
    rainAudio: document.getElementById('rainAudio')
};

// ============ APPLICATION STATE ============
let appState = {
    currentWeather: null,
    hourlyForecast: [],
    dailyForecast: [],
    units: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.UNITS) || 'metric',
    soundEnabled: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.SOUND_ENABLED) !== 'false',
    lastSearchedCity: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.LAST_CITY) || CONFIG.DEFAULT_CITY,
    isLoading: false,
    isSoundPlaying: false
};

// ============ WEATHER ICONS (SVG) ============
const WEATHER_ICONS = {
    clear: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="35" r="25" fill="#FFD700" opacity="0.9"/>
            <circle cx="50" cy="35" r="22" fill="#FFC700" opacity="0.8"/>
            <!-- Sun rays -->
            <line x1="50" y1="5" x2="50" y2="0" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
            <line x1="50" y1="65" x2="50" y2="70" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
            <line x1="80" y1="35" x2="85" y2="35" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
            <line x1="20" y1="35" x2="15" y2="35" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    clouds: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M 20 55 Q 20 40, 35 40 Q 40 20, 60 20 Q 80 20, 85 40 Q 90 40, 90 55 Q 90 70, 75 75 L 25 75 Q 20 70, 20 55 Z" 
                  fill="#E0E0E0" opacity="0.9" stroke="#C0C0C0" stroke-width="1"/>
        </svg>
    `,
    rain: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M 25 50 Q 25 35, 40 35 Q 45 15, 65 15 Q 85 15, 90 35 Q 95 35, 95 50 Q 95 65, 80 70 L 30 70 Q 25 65, 25 50 Z" 
                  fill="#A9A9A9" opacity="0.85"/>
            <!-- Raindrops -->
            <line x1="35" y1="75" x2="30" y2="90" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <line x1="50" y1="75" x2="45" y2="90" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <line x1="65" y1="75" x2="60" y2="90" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <line x1="80" y1="75" x2="75" y2="90" stroke="#4A90E2" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        </svg>
    `,
    storm: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M 20 55 Q 20 35, 40 35 Q 45 10, 70 10 Q 90 10, 95 35 Q 100 35, 100 55 Q 100 70, 85 75 L 25 75 Q 20 70, 20 55 Z" 
                  fill="#4A4A4A" opacity="0.9"/>
            <!-- Lightning -->
            <path d="M 50 80 L 45 95 L 55 90 L 50 105" stroke="#FFD700" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="50" cy="25" r="3" fill="#FFD700" opacity="0.7"/>
        </svg>
    `,
    snow: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M 25 50 Q 25 35, 40 35 Q 45 15, 65 15 Q 85 15, 90 35 Q 95 35, 95 50 Q 95 65, 80 70 L 30 70 Q 25 65, 25 50 Z" 
                  fill="#E8F4F8" opacity="0.85"/>
            <!-- Snowflakes -->
            <text x="30" y="85" font-size="20" fill="#B3D9FF" opacity="0.8">❄</text>
            <text x="50" y="85" font-size="20" fill="#B3D9FF" opacity="0.8">❄</text>
            <text x="70" y="85" font-size="20" fill="#B3D9FF" opacity="0.8">❄</text>
        </svg>
    `,
    night: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="60" cy="35" r="20" fill="#FFE5B4" opacity="0.8"/>
            <circle cx="50" cy="35" r="20" fill="#1A1A2E" opacity="0.9"/>
            <circle cx="25" cy="20" r="2" fill="#FFF" opacity="0.7"/>
            <circle cx="75" cy="15" r="1.5" fill="#FFF" opacity="0.6"/>
            <circle cx="20" cy="50" r="1" fill="#FFF" opacity="0.5"/>
            <circle cx="85" cy="45" r="2" fill="#FFF" opacity="0.7"/>
        </svg>
    `,
    mist: () => `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="15" y="30" width="70" height="8" fill="#D3D3D3" opacity="0.7" rx="4"/>
            <rect x="15" y="45" width="65" height="8" fill="#D3D3D3" opacity="0.6" rx="4"/>
            <rect x="15" y="60" width="70" height="8" fill="#D3D3D3" opacity="0.7" rx="4"/>
            <rect x="15" y="75" width="60" height="8" fill="#D3D3D3" opacity="0.6" rx="4"/>
        </svg>
    `
};

// ============ UTILITY FUNCTIONS ============

/**
 * Show loading spinner
 */
function showLoading() {
    appState.isLoading = true;
    DOM.loadingSpinner.classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    appState.isLoading = false;
    DOM.loadingSpinner.classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    DOM.errorMessage.textContent = message;
    DOM.errorMessage.classList.remove('hidden');
    setTimeout(() => {
        DOM.errorMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Get weather icon based on condition
 */
function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        return WEATHER_ICONS.clear();
    } else if (conditionLower.includes('cloud')) {
        return WEATHER_ICONS.clouds();
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return WEATHER_ICONS.rain();
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return WEATHER_ICONS.storm();
    } else if (conditionLower.includes('snow')) {
        return WEATHER_ICONS.snow();
    } else if (conditionLower.includes('night') || conditionLower.includes('moon')) {
        return WEATHER_ICONS.night();
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
        return WEATHER_ICONS.mist();
    }
    
    return WEATHER_ICONS.clear();
}

/**
 * Apply dynamic theme based on weather condition
 */
function applyDynamicTheme(condition) {
    const body = document.body;
    const conditionLower = condition.toLowerCase();
    
    // Remove all theme classes
    body.classList.remove(
        'theme-clear',
        'theme-clouds',
        'theme-rain',
        'theme-snow',
        'theme-storm',
        'theme-night'
    );
    
    // Apply appropriate theme
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        body.classList.add('theme-clear');
    } else if (conditionLower.includes('cloud')) {
        body.classList.add('theme-clouds');
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        body.classList.add('theme-rain');
    } else if (conditionLower.includes('snow')) {
        body.classList.add('theme-snow');
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        body.classList.add('theme-storm');
    } else if (conditionLower.includes('night') || conditionLower.includes('moon')) {
        body.classList.add('theme-night');
    } else {
        body.classList.add('theme-clear');
    }
}

/**
 * Handle rain audio playback
 */
function handleRainAudio(condition) {
    const conditionLower = condition.toLowerCase();
    const isRaining = conditionLower.includes('rain') || conditionLower.includes('drizzle');
    
    if (isRaining && appState.soundEnabled) {
        if (!appState.isSoundPlaying) {
            DOM.rainAudio.play().catch(err => {
                console.log('Audio playback failed:', err);
            });
            appState.isSoundPlaying = true;
            updateSoundToggleIcon();
        }
    } else {
        DOM.rainAudio.pause();
        appState.isSoundPlaying = false;
        updateSoundToggleIcon();
    }
}

/**
 * Update sound toggle icon
 */
function updateSoundToggleIcon() {
    const icon = DOM.soundToggle.querySelector('svg');
    if (appState.soundEnabled && appState.isSoundPlaying) {
        icon.style.opacity = '1';
    } else {
        icon.style.opacity = '0.5';
    }
}

/**
 * Convert temperature based on units
 */
function convertTemperature(temp, toUnit = appState.units) {
    if (toUnit === 'imperial') {
        return Math.round(temp * 9/5 + 32);
    }
    return Math.round(temp);
}

/**
 * Convert wind speed (m/s to km/h or mph)
 */
function convertWindSpeed(speed, toUnit = appState.units) {
    const kmh = speed * 3.6;
    if (toUnit === 'imperial') {
        return (kmh / 1.60934).toFixed(1);
    }
    return kmh.toFixed(1);
}

/**
 * Get wind speed unit
 */
function getWindSpeedUnit() {
    return appState.units === 'imperial' ? 'mph' : 'km/h';
}

/**
 * Get temperature unit
 */
function getTempUnit() {
    return appState.units === 'imperial' ? '°F' : '°C';
}

/**
 * Format time from timestamp
 */
function formatTime(timestamp, format = 'time') {
    const date = new Date(timestamp * 1000);
    if (format === 'time') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (format === 'day') {
        return date.toLocaleDateString([], { weekday: 'short' });
    } else if (format === 'date') {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

// ============ API FUNCTIONS ============

/**
 * Fetch weather data from OpenWeatherMap API
 */
async function fetchWeatherData(city) {
    try {
        showLoading();
        
        // Note: Using demo API key - replace with your actual key from https://openweathermap.org/api
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/weather?q=${city}&appid=${CONFIG.API_KEY}&units=${appState.units}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the city name and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please add your OpenWeatherMap API key in the config.');
            }
            throw new Error(`Weather API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Save last searched city
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.LAST_CITY, city);
        appState.lastSearchedCity = city;
        
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

/**
 * Fetch forecast data from OpenWeatherMap API
 */
async function fetchForecastData(lat, lon) {
    try {
        const response = await fetch(
            `${CONFIG.API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${appState.units}`
        );
        
        if (!response.ok) {
            throw new Error(`Forecast API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}

/**
 * Fetch weather using geolocation
 */
async function fetchWeatherByGeolocation() {
    return new Promise((resolve, reject) => {
        showLoading();
        
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser.'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Reverse geocode to get city name
                    const response = await fetch(
                        `${CONFIG.API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${CONFIG.API_KEY}&units=${appState.units}`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather for your location');
                    }
                    
                    const data = await response.json();
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            }
        );
    });
}

// ============ UI UPDATE FUNCTIONS ============

/**
 * Update current weather display
 */
function updateCurrentWeather(data) {
    if (!data) return;
    
    const { main, weather, wind, clouds, sys } = data;
    const condition = weather[0].main;
    const description = weather[0].description;
    const temp = convertTemperature(main.temp);
    const feelsLike = convertTemperature(main.feels_like);
    const humidity = main.humidity;
    const pressure = main.pressure;
    const windSpeed = convertWindSpeed(wind.speed);
    
    // Update DOM
    DOM.currentTemp.textContent = temp;
    DOM.weatherIcon.innerHTML = getWeatherIcon(condition);
    DOM.weatherCondition.textContent = description;
    DOM.locationName.textContent = data.name + (data.sys?.country ? ', ' + data.sys.country : '');
    DOM.humidity.textContent = humidity + '%';
    DOM.pressure.textContent = pressure + ' mb';
    DOM.windSpeed.textContent = windSpeed + ' ' + getWindSpeedUnit();
    DOM.feelsLike.textContent = feelsLike + getTempUnit();
    
    // Update temperature unit in header
    document.querySelector('.unit').textContent = getTempUnit();
    
    // Apply dynamic theme
    applyDynamicTheme(condition);
    
    // Handle rain audio
    handleRainAudio(condition);
    
    // Store in state
    appState.currentWeather = data;
}

/**
 * Update hourly forecast display
 */
function updateHourlyForecast(data) {
    if (!data || !data.list) return;
    
    DOM.hourlyForecast.innerHTML = '';
    
    // Show next 12 hours (every 3 hours from API)
    const hourlyData = data.list.slice(0, 8);
    
    hourlyData.forEach(hour => {
        const temp = convertTemperature(hour.main.temp);
        const condition = hour.weather[0].main;
        const time = formatTime(hour.dt, 'time');
        const iconHtml = getWeatherIcon(condition);
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-time">${time}</div>
            <div class="forecast-icon">${iconHtml}</div>
            <div class="forecast-temp">${temp}${getTempUnit()}</div>
            <div class="forecast-condition">${condition}</div>
        `;
        
        DOM.hourlyForecast.appendChild(forecastItem);
    });
}

/**
 * Update extended forecast display (5-day forecast)
 */
function updateExtendedForecast(data) {
    if (!data || !data.list) return;
    
    DOM.extendedForecast.innerHTML = '';
    
    // Group forecast by day
    const dayForecasts = {};
    
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayKey = date.toLocaleDateString();
        
        if (!dayForecasts[dayKey]) {
            dayForecasts[dayKey] = [];
        }
        dayForecasts[dayKey].push(forecast);
    });
    
    // Show next 5 days
    let dayCount = 0;
    for (const [date, forecasts] of Object.entries(dayForecasts)) {
        if (dayCount >= 5) break;
        dayCount++;
        
        // Calculate min/max temps and dominant condition
        const temps = forecasts.map(f => f.main.temp);
        const minTemp = convertTemperature(Math.min(...temps));
        const maxTemp = convertTemperature(Math.max(...temps));
        const condition = forecasts[0].weather[0].main;
        const humidity = Math.round(forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length);
        const windSpeed = convertWindSpeed(forecasts[0].wind.speed);
        
        const dayName = formatTime(forecasts[0].dt, 'day');
        const dateStr = formatTime(forecasts[0].dt, 'date');
        const iconHtml = getWeatherIcon(condition);
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <div class="forecast-day-name">${dayName}</div>
            <div class="forecast-day-date">${dateStr}</div>
            <div class="forecast-day-icon">${iconHtml}</div>
            <div class="forecast-day-temps">
                <div class="forecast-day-temp-high">${maxTemp}${getTempUnit()}</div>
                <div class="forecast-day-temp-low">${minTemp}${getTempUnit()}</div>
            </div>
            <div class="forecast-day-condition">${condition}</div>
            <div class="forecast-day-details">
                <div>💧 ${humidity}%</div>
                <div>💨 ${windSpeed} ${getWindSpeedUnit()}</div>
            </div>
        `;
        
        DOM.extendedForecast.appendChild(forecastDay);
    }
}

/**
 * Load weather for a city
 */
async function loadWeather(city) {
    try {
        showLoading();
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(weatherData.coord.lat, weatherData.coord.lon);
        
        updateCurrentWeather(weatherData);
        
        if (forecastData) {
            updateHourlyForecast(forecastData);
            updateExtendedForecast(forecastData);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error loading weather:', error);
    }
}

/**
 * Load weather by geolocation
 */
async function loadWeatherByGeolocation() {
    try {
        const weatherData = await fetchWeatherByGeolocation();
        const forecastData = await fetchForecastData(weatherData.coord.lat, weatherData.coord.lon);
        
        updateCurrentWeather(weatherData);
        
        if (forecastData) {
            updateHourlyForecast(forecastData);
            updateExtendedForecast(forecastData);
        }
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Geolocation error:', error);
    }
}

// ============ EVENT LISTENERS ============

/**
 * Search button click
 */
DOM.searchBtn.addEventListener('click', () => {
    const city = DOM.searchInput.value.trim();
    if (city) {
        loadWeather(city);
        DOM.searchInput.value = '';
    }
});

/**
 * Search input enter key
 */
DOM.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = DOM.searchInput.value.trim();
        if (city) {
            loadWeather(city);
            DOM.searchInput.value = '';
        }
    }
});

/**
 * Location button click
 */
DOM.locationBtn.addEventListener('click', () => {
    loadWeatherByGeolocation();
});

/**
 * Units toggle click
 */
DOM.unitsToggle.addEventListener('click', () => {
    appState.units = appState.units === 'metric' ? 'imperial' : 'metric';
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.UNITS, appState.units);
    DOM.unitsToggle.textContent = getTempUnit().charAt(0);
    
    // Reload current weather with new units
    if (appState.currentWeather) {
        updateCurrentWeather(appState.currentWeather);
        if (appState.hourlyForecast) {
            updateHourlyForecast(appState.hourlyForecast);
        }
        if (appState.dailyForecast) {
            updateExtendedForecast(appState.dailyForecast);
        }
    }
});

/**
 * Sound toggle click
 */
DOM.soundToggle.addEventListener('click', () => {
    appState.soundEnabled = !appState.soundEnabled;
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.SOUND_ENABLED, appState.soundEnabled);
    updateSoundToggleIcon();
    
    if (appState.soundEnabled && appState.currentWeather) {
        const condition = appState.currentWeather.weather[0].main;
        handleRainAudio(condition);
    } else {
        DOM.rainAudio.pause();
        appState.isSoundPlaying = false;
    }
});

// ============ INITIALIZATION ============

/**
 * Initialize the application
 */
function initializeApp() {
    // Set initial units toggle text
    DOM.unitsToggle.textContent = getTempUnit().charAt(0);
    
    // Update sound toggle icon
    updateSoundToggleIcon();
    
    // Load last searched city or default
    const lastCity = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.LAST_CITY) || CONFIG.DEFAULT_CITY;
    loadWeather(lastCity);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============ OPTIONAL: Handle audio preload for better performance ============
document.addEventListener('DOMContentLoaded', () => {
    // Preload audio for faster playback
    DOM.rainAudio.preload = 'metadata';
});
