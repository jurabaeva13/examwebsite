let cart = JSON.parse(localStorage.getItem('plantify_cart')) || [];
let likes = JSON.parse(localStorage.getItem('plantify_likes')) || [];
let allProducts = [];

// headerdagi logodagi sonlar update bo'lishi
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

// APIdan fetch orqali olib kelish
async function fetchAll() {
    const container = document.getElementById('all-products-container');
    try {
        const response = await fetch('https://jsonbek.uz/api/products?style=drama');
        const data = await response.json();

        if (Array.isArray(data)) {
            allProducts = data;
        } else if (data && data.value && Array.isArray(data.value)) {
            allProducts = data.value;
        } else {
            allProducts = [];
        }
        renderAll();
    } catch (error) {
        container.innerHTML = '<p class="text-red-500 text-center col-span-full">Failed to load products.</p>';
    }
}

// hamma productlar pageda chiqishi
function renderAll() {
    const container = document.getElementById('all-products-container');

    container.innerHTML = allProducts.map(product => {
        const isLiked = likes.includes(product.id);
        const price = product.price === 0 ? 'Free' : `${product.price.toLocaleString()} so'm`;

        return `
            <div class="group border border-gray-100 p-4 rounded-[20px] hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white">
                <div class="relative overflow-hidden rounded-[15px] mb-5 aspect-[3/4]">
                    <img src="${product.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.src='https://via.placeholder.com/279x360?text=No+Image'">
                    <button onclick="toggleLike(${product.id})" class="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? 'red' : 'none'}" stroke="${isLiked ? 'red' : '#004F44'}" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <h3 class="text-lg font-bold text-primary-green min-h-[56px] line-clamp-2">${product.title}</h3>
                <div class="text-green-800 font-bold text-xl mt-1 mb-2">${price}</div>
                <p class="text-text-gray text-xs mb-3 mt-auto uppercase tracking-wider">Category: ${product.origin}</p>
                <button onclick='addToCart(${JSON.stringify(product).replace(/'/g, "&apos;")})' class="w-full h-[45px] bg-primary-green text-white rounded-lg hover:bg-opacity-90 active:scale-95 transition-all font-dm-sans">Add to cart</button>
            </div>
        `;
    }).join('');
}

// Productlarni liked va unlike qilish
function toggleLike(id) {
    if (likes.includes(id)) {
        likes = likes.filter(likeId => likeId !== id);
    } else {
        likes.push(id);
    }
    localStorage.setItem('plantify_likes', JSON.stringify(likes));
    updateHeader();
    renderAll();
}

// Cartga tovar qo'shish
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

// responsive mobile
const menuButton = document.getElementById('mobile-menu-btn');
const closeButton = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuButton && closeButton && mobileMenu) {
    menuButton.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeButton.addEventListener('click', () => mobileMenu.classList.remove('active'));
}

// render Ui
updateHeader();
fetchAll();
