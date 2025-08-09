import { getWeatherData } from './weatherAPI.js';

// Hàm cập nhật thông tin thời tiết lên giao diện
export function updateWeatherDisplay(weatherData) {
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

// Hàm cập nhật ngày giờ hiện tại
function updateDateTime() {
    const now = new Date();
    
    // Cập nhật ngày trong tuần
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = document.querySelector('.dayOfWeek');
    if (dayOfWeek) dayOfWeek.textContent = days[now.getDay()];
    
    // Cập nhật ngày tháng năm
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayMonthYear = document.querySelector('.dayMonthYear');
    if (dayMonthYear) {
        dayMonthYear.textContent = `${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
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
