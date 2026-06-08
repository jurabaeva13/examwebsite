// Get saved data from the browser
let cart = JSON.parse(localStorage.getItem('plantify_cart')) || [];
let likes = JSON.parse(localStorage.getItem('plantify_likes')) || [];

// Update the price summary and like badge
function updateSummary() {
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);

    const subtotal = document.getElementById('subtotal-price');
    const totalEl = document.getElementById('total-price');

    if (subtotal) subtotal.textContent = `${total.toLocaleString()} so'm`;
    if (totalEl) totalEl.textContent = `${total.toLocaleString()} so'm`;

    const likeBadge = document.getElementById('like-count');
    if (likeBadge) {
        if (likes.length > 0) {
            likeBadge.textContent = likes.length;
            likeBadge.classList.remove('hidden');
        } else {
            likeBadge.classList.add('hidden');
        }
    }
}

// Change the quantity of an item in the cart
function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            const wantsToRemove = confirm('Do you want to remove this item from cart?');
            if (wantsToRemove) {
                cart = cart.filter(product => product.id !== productId);
            } else {
                item.quantity = 1;
            }
        }
        saveAndRefresh();
    }
}

// Remove an item from the cart
function removeItem(productId) {
    if (confirm('Remove this product from cart?')) {
        cart = cart.filter(product => product.id !== productId);
        saveAndRefresh();
    }
}

// Save to storage and refresh the page
function saveAndRefresh() {
    localStorage.setItem('plantify_cart', JSON.stringify(cart));
    renderCart();
    updateSummary();
}

// Show all items in the cart
function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20 bg-gray-50 rounded-[20px]">
                <p class="text-2xl font-libre text-green-900 mb-6">Your cart is empty.</p>
                <a href="../index.html" class="inline-block bg-green-900 text-white px-10 py-4">Start Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-gray-100 rounded-[20px] hover:shadow-md transition-all">
            <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded-xl shadow-sm">
            <div class="flex-grow text-center sm:text-left">
                <h3 class="text-xl font-bold text-green-900">${item.title}</h3>
                <p class="text-gray-400 text-sm">Category: ${item.origin || 'Milliy'}</p>
                <p class="text-green-700 text-sm mt-1">${item.price.toLocaleString()} so'm / unit</p>
            </div>
            <div class="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border">
                <button onclick="changeQuantity(${item.id}, -1)" class="w-8 h-8 font-bold hover:text-green-900">-</button>
                <span class="font-bold w-6 text-center text-lg">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)" class="w-8 h-8 font-bold hover:text-green-900">+</button>
            </div>
            <div class="text-xl font-bold w-32 text-right text-green-900">
                ${(item.price * item.quantity).toLocaleString()} so'm
            </div>
            <button onclick="removeItem(${item.id})" class="text-red-400 hover:text-red-600 p-2 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// Make functions available for HTML onclick attributes
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateSummary();

    const menuButton = document.getElementById('mobile-menu-btn');
    const closeButton = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && closeButton && mobileMenu) {
        menuButton.addEventListener('click', () => mobileMenu.classList.add('active'));
        closeButton.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
});
