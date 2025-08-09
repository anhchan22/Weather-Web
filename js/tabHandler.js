// Tab handler for navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all tab items
            tabItems.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Search input placeholder handler
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        // Store original placeholder
        const originalPlaceholder = searchInput.placeholder;
        
        // Clear placeholder when focused
        searchInput.addEventListener('focus', function() {
            this.placeholder = '';
        });
        
        // Restore placeholder when unfocused and empty
        searchInput.addEventListener('blur', function() {
            if (this.value === '') {
                this.placeholder = originalPlaceholder;
            }
        });
    }
});
