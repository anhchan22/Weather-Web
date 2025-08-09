import { searchWeather } from './weatherUI.js';

// Khởi tạo chức năng tìm kiếm khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');
    
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    // Xử lý khi nhấn Enter trong ô tìm kiếm
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Xử lý khi click vào icon search
    if (searchIcon) {
        searchIcon.addEventListener('click', handleSearch);
    }
    
    // Hàm xử lý tìm kiếm
    function handleSearch() {
        const cityName = searchInput.value.trim();
        
        if (cityName === '') {
            alert('Vui lòng nhập tên thành phố');
            return;
        }
        
        // Gọi hàm tìm kiếm thời tiết
        searchWeather(cityName);
        
        // Xóa nội dung ô tìm kiếm sau khi tìm
        searchInput.value = '';
        searchInput.blur(); // Bỏ focus khỏi input
    }
    
    // Tải thời tiết mặc định cho Hà Nội khi khởi động
    searchWeather('Ha Noi');
});

// Thêm sự kiện click để ẩn modal
document.addEventListener('click', function(e) {
    const modal = document.querySelector('.modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
