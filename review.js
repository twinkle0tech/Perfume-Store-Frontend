document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.querySelector('.star-rating');
    const ratingInput = document.getElementById('reviewRating');
    
    // Star rating functionality
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                highlightStars(rating);
            });

            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                ratingInput.value = rating;
                highlightStars(rating);
                stars.forEach(s => s.classList.add('active'));
            });
        });

        starRating.addEventListener('mouseleave', () => {
            const currentRating = parseInt(ratingInput.value);
            highlightStars(currentRating);
        });
    }

    function highlightStars(rating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ff9800';
            } else {
                star.style.color = '#ffc107';
            }
        });
    }

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const email = document.getElementById('reviewEmail').value.trim();
            const product = document.getElementById('productSelect').value;
            const rating = parseInt(ratingInput.value);
            const message = document.getElementById('reviewMessage').value.trim();

            if (!name || !message || !rating || !product) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            const newReview = {
                id: Date.now(),
                name,
                email,
                product,
                rating,
                message,
                date: new Date().toISOString()
            };

            // Get existing reviews
            let reviews = JSON.parse(localStorage.getItem('keluna-reviews')) || [];
            
            // Add new review to the beginning of the array
            reviews.unshift(newReview);
            
            // Store in localStorage
            localStorage.setItem('keluna-reviews', JSON.stringify(reviews));

            // Show success message
            showNotification('Review submitted successfully! Redirecting...');

            // Reset form
            reviewForm.reset();
            highlightStars(5);

            // Redirect back to main page after short delay
            setTimeout(() => {
                window.location.href = 'index.html#testimonials';
            }, 1500);
        });
    }

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}); 