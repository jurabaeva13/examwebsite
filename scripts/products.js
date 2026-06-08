// Get saved data from the browser
let cart = JSON.parse(localStorage.getItem('plantify_cart')) || [];
let likes = JSON.parse(localStorage.getItem('plantify_likes')) || [];
let allProducts = [];

// Update the badge numbers in the header
function updateHeader() {
    const cartBadge = document.getElementById('cart-count');
    const likeBadge = document.getElementById('like-count');

    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);

    if (cartBadge) {
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }
    if (likeBadge) {
        if (likes.length > 0) {
            likeBadge.textContent = likes.length;
            likeBadge.classList.remove('hidden');
        } else {
            likeBadge.classList.add('hidden');
        }
    }
}

// Fetch products from the API
async function fetchProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    container.innerHTML = '<p class="text-xl font-libre">Loading products...</p>';

    try {
        const response = await fetch('https://jsonbek.uz/api/products?style=drama');
        if (!response.ok) throw new Error('Server error occurred!');

        const data = await response.json();
        if (Array.isArray(data)) {
            allProducts = data;
        } else if (data && data.value && Array.isArray(data.value)) {
            allProducts = data.value;
        } else {
            allProducts = [];
        }
        renderProducts();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}

// Show products on the page
function renderProducts() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;
    container.innerHTML = '';

    allProducts.forEach(product => {
        const isLiked = likes.includes(product.id);
        const card = document.createElement('div');
        card.className = 'relative w-[279px] shrink-0 group';
        const price = product.price === 0 ? 'Free' : `${product.price.toLocaleString()} so'm`;

        card.innerHTML = `
            <div class="relative overflow-hidden rounded-[20px] mb-5 shadow-sm bg-gray-50">
                <img src="${product.image}" class="w-[279px] h-[360px] object-cover transition-all group-hover:scale-110" onerror="this.src='https://via.placeholder.com/279x360?text=No+Image'">
                <button class="like-button absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isLiked ? 'red' : 'none'}" stroke="${isLiked ? 'red' : 'green'}" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="relative mb-6">
                <h3 class="text-[20px] font-bold text-green-900">${product.title}</h3>
                <div class="text-green-800 font-bold text-lg mt-1">${price}</div>
                <p class="text-gray-400 text-sm mt-2">Category: ${product.origin}</p>
                <div class="mt-2 text-yellow-500">★ ${product.rate}</div>
                <button class="add-to-cart-button mt-4 w-full h-[45px] bg-green-900 text-white rounded hover:opacity-90 active:scale-95 transition-all">Add to cart</button>
            </div>
        `;

        card.querySelector('.like-button').addEventListener('click', () => toggleLike(product.id));
        card.querySelector('.add-to-cart-button').addEventListener('click', () => addToCart(product));
        container.appendChild(card);
    });
}

// Like or unlike a product
function toggleLike(id) {
    if (likes.includes(id)) {
        likes = likes.filter(likeId => likeId !== id);
    } else {
        likes.push(id);
    }
    localStorage.setItem('plantify_likes', JSON.stringify(likes));
    updateHeader();
    renderProducts();
}

// Add a product to the cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('plantify_cart', JSON.stringify(cart));
    updateHeader();
    alert('Product added to cart!');
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    fetchProducts();
});
