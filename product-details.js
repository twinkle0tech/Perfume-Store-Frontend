// Product data
const products = {
    1: {
        id: 1,
        name: "Floral Elegance",
        price: 59.99,
        image: "perfume1.png",
        description: "A sophisticated blend of delicate floral notes, creating an enchanting and timeless fragrance. Perfect for those who appreciate the subtle beauty of nature's finest blooms.",
        features: [
            "Top notes of jasmine and rose petals",
            "Heart notes of lily of the valley and peony",
            "Base notes of white musk and vanilla",
            "Long-lasting fragrance (8-10 hours)",
            "Made with natural essential oils",
            "Elegant glass bottle design"
        ]
    },
    2: {
        id: 2,
        name: "Woody Mystique",
        price: 69.99,
        image: "perfume2.png",
        description: "An intoxicating fusion of rich woody elements and exotic spices, creating a mysterious and sophisticated scent that leaves a lasting impression.",
        features: [
            "Top notes of bergamot and black pepper",
            "Heart notes of cedarwood and sandalwood",
            "Base notes of amber and patchouli",
            "Perfect for evening wear",
            "Unique blend of rare wood extracts",
            "Sustainable packaging"
        ]
    },
    3: {
        id: 3,
        name: "Citrus Zest",
        price: 49.99,
        image: "perfume3.png",
        description: "A refreshing and invigorating blend of citrus fruits, creating an energetic and uplifting fragrance perfect for daily wear.",
        features: [
            "Top notes of lemon and mandarin",
            "Heart notes of orange blossom and grapefruit",
            "Base notes of vetiver and light musk",
            "Perfect for daytime wear",
            "Made with cold-pressed citrus oils",
            "Recyclable packaging"
        ]
    },
    4: {
        id: 4,
        name: "Oriental Dream",
        price: 79.99,
        image: "perfume4.png",
        description: "An exotic journey through the finest oriental ingredients, creating a rich and mesmerizing fragrance that embodies luxury and sophistication.",
        features: [
            "Top notes of saffron and cardamom",
            "Heart notes of rose and oud wood",
            "Base notes of vanilla and amber",
            "Premium long-lasting formula",
            "Rare and exotic ingredients",
            "Handcrafted bottle design"
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    // Get product data
    const product = products[productId];
    
    if (!product) {
        window.location.href = 'index.html#products';
        return;
    }
    
    // Update page content
    document.title = `${product.name} - Keluna Mist`;
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    
    // Update features list
    const featuresList = document.getElementById('productFeatures');
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // Handle quantity changes
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // Handle add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const cart = JSON.parse(localStorage.getItem('keluna-cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                image: product.image
            });
        }
        
        localStorage.setItem('keluna-cart', JSON.stringify(cart));
        
        // Show confirmation
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${quantity} ${product.name} added to cart`;
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
        
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    });
});