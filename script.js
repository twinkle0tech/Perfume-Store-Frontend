document.addEventListener('DOMContentLoaded', function() {
    // Progress tracking state
    const progressState = {
        homepage: false,
        about: false,
        products: false,
        contact: false,
        cartInteraction: false,
        formSubmission: false
    };

    // Progress weights for each action
    const progressWeights = {
        homepage: 10,
        about: 10,
        products: 20,
        contact: 10,
        cartInteraction: 30,
        formSubmission: 20
    };

    // Initialize progress from localStorage
    let progress = parseInt(localStorage.getItem('siteProgress')) || 0;

    // Progress bar elements
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressSection = document.querySelector('.progress-section');

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress';
    resetButton.className = 'reset-progress';
    document.querySelector('.progress-controls').appendChild(resetButton);

    // Function to update progress bar
    function updateProgressBar() {
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        // Update color based on progress
        if (progress < 30) {
            progressBar.style.backgroundColor = '#ff5252';
        } else if (progress < 70) {
            progressBar.style.backgroundColor = '#ffc107';
        } else {
            progressBar.style.backgroundColor = '#5d7b3e';
        }

        // Save to localStorage
        localStorage.setItem('siteProgress', progress.toString());
    }

    // Function to update progress for a specific action
    function updateProgress(action) {
        if (!progressState[action]) {
            progressState[action] = true;
            progress = Math.min(100, progress + progressWeights[action]);
            updateProgressBar();
        }
    }

    // Track section visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId) {
                    updateProgress(sectionId);
                }
            }
        });
    }, { threshold: 0.5 });

    // Observe sections
    ['about', 'products', 'contact'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) observer.observe(section);
    });

    // Track homepage visit
    updateProgress('homepage');

    // Track cart interactions
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateProgress('cartInteraction');
        });
    });

    // Track form submission
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            updateProgress('formSubmission');
        });
    }

    // Reset progress functionality
    resetButton.addEventListener('click', () => {
        progress = 0;
        Object.keys(progressState).forEach(key => {
            progressState[key] = false;
        });
        updateProgressBar();
        
        // Show reset confirmation
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Progress has been reset!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    });

    // Initialize progress bar
    updateProgressBar();

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Cart functionality
    const cart = JSON.parse(localStorage.getItem('keluna-cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartLink = document.getElementById('cart-link');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Update cart totals
    function updateCartTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to new buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }

    // Add to cart function
    function addToCart(productId, productName, productPrice) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1,
                image: `perfume${productId}.png`
            });
        }
        
        // Update localStorage
        localStorage.setItem('keluna-cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        renderCartItems();
        updateCartTotals();
        
        // Show confirmation
        showNotification(`${productName} added to cart`);
    }

    // Remove item from cart
    function removeItem(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            localStorage.setItem('keluna-cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
            updateCartTotals();
            showNotification('Item removed from cart');
        }
    }

    // Increase quantity
    function increaseQuantity(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += 1;
            localStorage.setItem('keluna-cart', JSON.stringify(cart));
            renderCartItems();
            updateCartTotals();
            updateCartCount();
        }
    }

    // Decrease quantity
    function decreaseQuantity(e) {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('keluna-cart', JSON.stringify(cart));
            renderCartItems();
            updateCartTotals();
            updateCartCount();
        }
    }

    // Cart sidebar toggle
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });

    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            const productName = e.currentTarget.getAttribute('data-name');
            const productPrice = e.currentTarget.getAttribute('data-price');
            addToCart(productId, productName, productPrice);
        });
    });

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
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

    // Reviews functionality
    function deleteReview(reviewId) {
        let reviews = JSON.parse(localStorage.getItem('keluna-reviews')) || [];
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('keluna-reviews', JSON.stringify(reviews));
        loadReviews(); // Reload the reviews display
        showNotification('Review deleted successfully');
    }

    function loadReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        const reviews = JSON.parse(localStorage.getItem('keluna-reviews')) || [];
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p class="text-center text-gray-500">No reviews yet. Be the first to review!</p>';
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="border border-[#1f3a3a] rounded-lg p-5 bg-[#A7C98F]">
                <div class="text-[#ff6600] mb-2">
                    ${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}
                    ${Array(5 - review.rating).fill('<i class="far fa-star"></i>').join('')}
                </div>
                <div class="text-sm mb-2 font-semibold">
                    ${review.product}
                </div>
                <p class="text-sm mb-4 leading-relaxed">
                    ${review.message}
                </p>
                <div class="flex justify-between text-xs font-semibold">
                    <span>${review.name}</span>
                    <span>Verified Buyer <i class="fas fa-check-circle"></i></span>
                </div>
            </div>
        `).join('');
    }

    // Make deleteReview function globally available
    window.deleteReview = deleteReview;

    // Load reviews on page load
    loadReviews();

    // Initialize cart
    updateCartCount();
    renderCartItems();
    updateCartTotals();

    // Scroll to products
    window.scrollToProducts = function() {
        document.getElementById('products').scrollIntoView({
            behavior: 'smooth'
        });
    };
});