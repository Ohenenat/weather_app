# 🌤️ Weather Application

A fully functional, modern weather application built with HTML, CSS, and JavaScript. Features dynamic themes based on weather conditions, hourly forecasts, and realistic rain sound effects.

## ✨ Features

### Core Features
- ✅ **Real-time Weather Data** - Get current weather using OpenWeatherMap API
- ✅ **Dynamic Themes** - Automatic background changes based on weather conditions
- ✅ **Geolocation Support** - Auto-detect user's location
- ✅ **City Search** - Search weather for any city worldwide
- ✅ **Temperature Units** - Toggle between Celsius and Fahrenheit
- ✅ **Hourly Forecast** - See weather for the next 12-24 hours
- ✅ **Extended Forecast** - 5-day weather outlook
- ✅ **Detailed Metrics** - Humidity, pressure, wind speed, feels-like temperature

### Weather Themes
- ☀️ **Clear/Sunny** - Bright purple gradient
- ☁️ **Cloudy** - Soft grey gradient
- 🌧️ **Rainy** - Dark stormy gradient + Rain audio
- ❄️ **Snow** - Light blue/cyan gradient
- ⛈️ **Thunderstorm** - Very dark dramatic gradient
- 🌙 **Night** - Deep blue night gradient

### Audio System
- 🔊 **Rain Sound Effects** - Plays when weather is rainy
- 🔇 **Mute/Unmute Toggle** - Control audio playback
- 🔄 **Looping Audio** - Seamless rain sound loop

### Additional Features
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Local Storage** - Remembers last searched city and preferences
- ⚡ **Loading Animation** - Smooth loading indicator
- 🎨 **Smooth Transitions** - Beautiful CSS animations
- ♿ **Accessibility** - Respects prefers-reduced-motion
- ⚠️ **Error Handling** - User-friendly error messages

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Free API key from OpenWeatherMap

### Getting Your API Key

1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key
5. Open `js/script.js` and replace `CONFIG.API_KEY: 'demo'` with your actual key

```javascript
// Line ~16 in js/script.js
const CONFIG = {
    API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace 'demo' with your key
    // ... rest of config
};
```

### Installation

1. **Download/Clone the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd weather-app
   ```

2. **Add Rain Sound** (Optional but recommended)
   - Download a rain sound MP3 from:
     - [Freesound.org](https://freesound.org/search/?q=rain)
     - [Pixabay](https://pixabay.com/sound-effects/search/rain/)
   - Save it as `audio/rain-sound.mp3`

3. **Open the app**
   - Simply open `index.html` in your web browser



```

## 🎮 How to Use

### Search Weather
1. Type a city name in the search bar
2. Press Enter or click the search button
3. View weather details and forecasts

### Use Geolocation
1. Click the location button (pin icon) in the header
2. Allow browser access to your location when prompted
3. Weather for your location loads automatically

### Toggle Temperature Units
- Click the unit toggle (°C or °F) in the header
- All temperatures update instantly

### Control Rain Sound
- Click the speaker icon to toggle rain sound on/off
- Sound automatically plays when weather is rainy (if enabled)
- Only works with rainy/drizzle weather conditions

### View Forecasts
- **Hourly Forecast**: Scroll through next 12+ hours of predictions
- **Extended Forecast**: See 5-day outlook with min/max temps

## 🎨 Customization

### Change Default City
Edit `js/script.js` line ~14:
```javascript
DEFAULT_CITY: 'New York'  // Change to your city
```

### Adjust Theme Colors
Edit `css/style.css` :root section:
```css
:root {
    --theme-clear: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Modify gradient colors as needed */
}
```

### Add Custom Weather Icons
Replace the SVG icons in `WEATHER_ICONS` object in `js/script.js`

## 🔧 API Reference

### OpenWeatherMap Endpoints Used

**Current Weather:**
```
GET /weather?q={city}&appid={API_KEY}&units={units}
```

**Forecast:**
```
GET /forecast?lat={latitude}&lon={longitude}&appid={API_KEY}&units={units}
```

### Units
- `metric` - Celsius, meters/sec, km/h
- `imperial` - Fahrenheit, meters/sec, mph

### Weather Conditions
- Clear, Clouds, Rain, Drizzle, Snow, Mist, Thunderstorm, etc.

## 🔒 Important Notes

### API Key Security
- **DO NOT** commit your API key to public repositories
- Store sensitive keys in environment variables for production
- Consider using a backend proxy for API calls in production

### Audio Requirements
- Rain sound requires MP3 file in `audio/rain-sound.mp3`
- Must be served over HTTP/HTTPS (not file://)
- Consider audio file size for performance
- Some browsers may require user interaction for autoplay

### Browser Compatibility
- Modern browsers with ES6 support
- Geolocation API support required for location feature
- Web Audio API support recommended for potential future enhancements

## 📊 Performance Optimization

- ✅ Lightweight SVG icons (no external image files)
- ✅ CSS animations instead of JavaScript animations
- ✅ Lazy audio loading (`preload="none"`)
- ✅ Efficient DOM updates
- ✅ Local storage for faster subsequent loads

## 🐛 Troubleshooting

### Weather Not Loading
1. Check your API key is correct in `js/script.js`
2. Verify internet connection
3. Check browser console for errors (F12 → Console)
4. Ensure API key has weather permissions enabled

### Rain Sound Not Playing
1. Verify `audio/rain-sound.mp3` exists
2. Check browser console for audio errors
3. Ensure sound toggle is enabled (speaker icon)
4. Try a different browser
5. Serve via HTTP/HTTPS (not file://)

### Location Not Working
1. Check browser permissions for location access
2. Ensure Geolocation API is enabled
3. Try Firefox if Chrome doesn't work
4. Check if location services are enabled on your device

### Styling Issues on Mobile
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check CSS file is loading (browser DevTools → Network tab)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and up (full layout)
- **Tablet**: 768px to 1199px (adjusted grid)
- **Mobile**: Below 768px (single column)
- **Small Mobile**: Below 480px (compact layout)

## 🎯 Future Enhancement Ideas

- [ ] Add weekly forecast
- [ ] Air quality index (AQI)
- [ ] UV index
- [ ] Sunrise/Sunset times
- [ ] Multiple city comparison
- [ ] Weather alerts
- [ ] Dark mode toggle
- [ ] Download weather data as JSON
- [ ] PWA support for offline access
- [ ] Custom notification sounds

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: SVG (custom created)
- Inspiration: Modern weather applications

## 📞 Support

For issues, questions, or suggestions, please check:
1. Browser console for error messages
2. API key validity
3. Network tab in DevTools for API calls
4. This README troubleshooting section

---

**Enjoy your weather app!** 🌤️⛅🌦️
