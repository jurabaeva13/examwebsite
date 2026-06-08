// Get saved data from the browser
let likes = JSON.parse(localStorage.getItem('plantify_likes')) || [];
let cart = JSON.parse(localStorage.getItem('plantify_cart')) || [];

// Update the badge numbers in the header
function updateHeader() {
    const cartBadge = document.getElementById('cart-count');
    const likeBadge = document.getElementById('like-count');

    let cartTotal = 0;
    cart.forEach(item => cartTotal += item.quantity);

    if (cartTotal > 0) {
        cartBadge.textContent = cartTotal;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
    if (likes.length > 0) {
        likeBadge.textContent = likes.length;
        likeBadge.classList.remove('hidden');
    } else {
        likeBadge.classList.add('hidden');
    }
}

// Show the liked (wishlist) products
async function renderLikes() {
    const container = document.getElementById('liked-container');

    if (likes.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20 bg-gray-50 rounded-[20px]">
                <p class="text-xl text-text-gray mb-6">Your wishlist is empty.</p>
                <a href="../index.html" class="inline-block bg-primary-green text-white px-10 py-4 rounded-lg">Go back to shop</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('https://jsonbek.uz/api/products?style=drama');
        const data = await response.json();

        let allProducts = [];
        if (Array.isArray(data)) {
            allProducts = data;
        } else if (data && data.value && Array.isArray(data.value)) {
            allProducts = data.value;
        }

        const likedProducts = allProducts.filter(product => likes.includes(product.id));

        container.innerHTML = likedProducts.map(product => `
            <div class="group border border-gray-100 p-4 rounded-[20px] bg-white transition-all hover:shadow-xl">
                <div class="relative overflow-hidden rounded-[15px] mb-5 aspect-[3/4]">
                    <img src="${product.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <button onclick="removeLike(${product.id})" class="absolute top-3 right-3 w-9 h-9 bg-white p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <h3 class="text-lg font-bold text-primary-green min-h-[56px] line-clamp-2">${product.title}</h3>
                <p class="text-green-800 font-bold text-xl mt-1 mb-4">${product.price.toLocaleString()} so'm</p>
                <button onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})' class="w-full bg-primary-green text-white py-3 rounded-lg hover:bg-opacity-90 active:scale-95 transition-all">Add to Cart</button>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-red-500 text-center col-span-full">Error loading wishlist.</p>';
    }
}

// Remove a product from the liked list
function removeLike(id) {
    likes = likes.filter(like => like !== id);
    localStorage.setItem('plantify_likes', JSON.stringify(likes));
    renderLikes();
    updateHeader();
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
    alert('Added to cart!');
}

// Mobile menu
const menuButton = document.getElementById('mobile-menu-btn');
const closeButton = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuButton && closeButton && mobileMenu) {
    menuButton.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeButton.addEventListener('click', () => mobileMenu.classList.remove('active'));
}

// Start the app
updateHeader();
renderLikes();
