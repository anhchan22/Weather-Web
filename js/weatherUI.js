import { getWeatherData } from './weatherAPI.js';

// Biến global để lưu timezone của thành phố hiện tại
let currentTimezone = 0; // Timezone offset in seconds

// Hàm cập nhật thông tin thời tiết lên giao diện
export function updateWeatherDisplay(weatherData) {
    // Lưu timezone của thành phố
    currentTimezone = weatherData.timezone;
    
    // Cập nhật tên thành phố và quốc gia
    const cityName = document.querySelector('.city-name');
    const countryName = document.querySelector('.country-name');
    
    if (cityName) cityName.textContent = weatherData.city;
    if (countryName) countryName.textContent = weatherData.country;
    
    // Cập nhật nhiệt độ hiện tại
    const temperatureTemp = document.querySelector('.temperature-temp');
    if (temperatureTemp) temperatureTemp.textContent = weatherData.temperature;
    
    // Cập nhật nhiệt độ cảm nhận
    const temperatureFeelsLike = document.querySelector('.temperature-feels-like');
    if (temperatureFeelsLike) temperatureFeelsLike.textContent = weatherData.feelsLike;
    
    // Cập nhật nhiệt độ cao nhất và thấp nhất
    const temperatureMax = document.querySelector('.temperature-max');
    const temperatureMin = document.querySelector('.temperature-min');
    
    if (temperatureMax) temperatureMax.textContent = weatherData.tempMax;
    if (temperatureMin) temperatureMin.textContent = weatherData.tempMin;
    
    // Cập nhật mô tả thời tiết
    const weatherOverview = document.querySelector('.weather-overview');
    if (weatherOverview) weatherOverview.textContent = weatherData.weather;
    
    // Cập nhật icon thời tiết
    updateWeatherIcon(weatherData.weather, weatherData.icon);
    
    // Cập nhật thông tin bổ sung
    updateAdditionalInfo(weatherData);
    
    // Cập nhật ngày và giờ hiện tại
    updateDateTime();
}

// Hàm cập nhật icon thời tiết
function updateWeatherIcon(weather, iconCode) {
    const weatherIcon = document.querySelector('.weather-icon i');
    
    if (!weatherIcon) return;
    
    // Xóa các class cũ
    weatherIcon.className = '';
    
    // Thêm class FontAwesome dựa trên loại thời tiết
    switch(weather.toLowerCase()) {
        case 'clear':
            weatherIcon.className = 'fa-solid fa-sun';
            break;
        case 'clouds':
            weatherIcon.className = 'fa-solid fa-cloud';
            break;
        case 'rain':
            weatherIcon.className = 'fa-solid fa-cloud-rain';
            break;
        case 'drizzle':
            weatherIcon.className = 'fa-solid fa-cloud-drizzle';
            break;
        case 'thunderstorm':
            weatherIcon.className = 'fa-solid fa-cloud-bolt';
            break;
        case 'snow':
            weatherIcon.className = 'fa-solid fa-snowflake';
            break;
        case 'mist':
        case 'fog':
            weatherIcon.className = 'fa-solid fa-smog';
            break;
        default:
            weatherIcon.className = 'fa-solid fa-cloud-sun';
    }
}

// Hàm cập nhật thông tin bổ sung (sunrise, sunset, humidity, wind)
function updateAdditionalInfo(weatherData) {
    // Cập nhật Sunrise
    const sunriseElement = document.querySelector('.sun-rise-hour');
    if (sunriseElement && weatherData.sunrise) {
        const sunriseTime = new Date(weatherData.sunrise * 1000);
        const utc = sunriseTime.getTime() + (sunriseTime.getTimezoneOffset() * 60000);
        const localSunrise = new Date(utc + (currentTimezone * 1000));
        const hours = localSunrise.getHours().toString().padStart(2, '0');
        const minutes = localSunrise.getMinutes().toString().padStart(2, '0');
        sunriseElement.textContent = `${hours}:${minutes}`;
    }
    
    // Cập nhật Sunset
    const sunsetElement = document.querySelector('.sun-set-hour');
    if (sunsetElement && weatherData.sunset) {
        const sunsetTime = new Date(weatherData.sunset * 1000);
        const utc = sunsetTime.getTime() + (sunsetTime.getTimezoneOffset() * 60000);
        const localSunset = new Date(utc + (currentTimezone * 1000));
        const hours = localSunset.getHours().toString().padStart(2, '0');
        const minutes = localSunset.getMinutes().toString().padStart(2, '0');
        sunsetElement.textContent = `${hours}:${minutes}`;
    }
    
    // Tính Length of day
    const lengthElement = document.querySelector('.length-of-day');
    if (lengthElement && weatherData.sunrise && weatherData.sunset) {
        const dayLength = weatherData.sunset - weatherData.sunrise;
        const hours = Math.floor(dayLength / 3600);
        const minutes = Math.floor((dayLength % 3600) / 60);
        lengthElement.textContent = `${hours}h ${minutes}m`;
    }
    
    // Cập nhật Humidity trong Today Highlight
    const humidityElements = document.querySelectorAll('.content-item');
    humidityElements.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === 'Humidity') {
            const div = item.querySelector('div');
            if (div) {
                div.innerHTML = `<span style="font-size: 24px; font-weight: bold;">${weatherData.humidity}%</span>`;
            }
        }
    });
    
    // Cập nhật Wind Status trong Today Highlight
    humidityElements.forEach(item => {
        const span = item.querySelector('span');
        if (span && span.textContent === 'Wind Status') {
            const div = item.querySelector('div');
            if (div && weatherData.windSpeed !== undefined) {
                const windSpeedKmh = Math.round(weatherData.windSpeed * 3.6); // Convert m/s to km/h
                const windDirection = getWindDirection(weatherData.windDirection);
                div.innerHTML = `<span style="font-size: 20px; font-weight: bold;">${windSpeedKmh} km/h</span><br><span style="font-size: 14px;">${windDirection}</span>`;
            }
        }
    });
}

// Hàm chuyển đổi độ sang hướng gió
function getWindDirection(degrees) {
    if (degrees === undefined) return 'N/A';
    
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Hàm cập nhật ngày giờ hiện tại
function updateDateTime() {
    // Tính toán thời gian địa phương của thành phố
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC time
    const localTime = new Date(utc + (currentTimezone * 1000)); // Local time của thành phố
    
    // Cập nhật thời gian
    const time = document.querySelector('.time');
    if (time) {
        const hours = localTime.getHours().toString().padStart(2, '0');
        const minutes = localTime.getMinutes().toString().padStart(2, '0');
        const seconds = localTime.getSeconds().toString().padStart(2, '0');
        time.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Cập nhật ngày trong tuần
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = document.querySelector('.dayOfWeek');
    if (dayOfWeek) dayOfWeek.textContent = days[localTime.getDay()];
    
    // Cập nhật ngày tháng năm
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayMonthYear = document.querySelector('.dayMonthYear');
    if (dayMonthYear) {
        dayMonthYear.textContent = `${localTime.getDate()} ${months[localTime.getMonth()]}, ${localTime.getFullYear()}`;
    }
}

// Hàm hiển thị thông báo lỗi
export function showError(message) {
    const modal = document.querySelector('.modal');
    const modalMessage = document.querySelector('.modal-message');
    
    if (modalMessage) modalMessage.textContent = message;
    if (modal) {
        modal.style.display = 'flex';
        
        // Tự động ẩn modal sau 3 giây
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }
}

// Hàm xử lý tìm kiếm thời tiết
export async function searchWeather(cityName) {
    try {
        // Hiển thị loading (có thể thêm spinner)
        console.log('Searching weather for:', cityName);
        
        // Gọi API
        const weatherData = await getWeatherData(cityName);
        
        // Cập nhật giao diện
        updateWeatherDisplay(weatherData);
        
        console.log('Weather data updated successfully');
        
    } catch (error) {
        console.error('Search failed:', error);
        showError('Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.');
    }
}

// Khởi tạo cập nhật thời gian tự động
export function initializeDateTime() {
    // Khởi tạo timezone mặc định cho Hà Nội (UTC+7 = 7*3600 = 25200 seconds)
    if (currentTimezone === 0) {
        currentTimezone = 25200; // UTC+7 for Vietnam
    }
    
    // Cập nhật ngay lập tức
    updateDateTime();
    
    // Cập nhật mỗi giây
    setInterval(updateDateTime, 1000);
}
