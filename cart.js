// ── Cart storage ────────────────────────────────────────────────────────────
function getCart()       { return JSON.parse(localStorage.getItem('finstatech_cart') || '[]'); }
function saveCart(cart)  { localStorage.setItem('finstatech_cart', JSON.stringify(cart)); }

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
    saveCart(cart);
    updateCartBadge();
    showCartToast(product.name);
}

function removeFromCart(id) {
    saveCart(getCart().filter(i => i.id !== id));
    updateCartBadge();
}

function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) { item.qty = Math.max(1, qty); saveCart(cart); }
    updateCartBadge();
}

function clearCart() { localStorage.removeItem('finstatech_cart'); updateCartBadge(); }

// ── Badge ────────────────────────────────────────────────────────────────────
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

// ── Toast notification ────────────────────────────────────────────────────────
function showCartToast(name) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = `✓ ${name} added to cart`;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Inject cart icon into header ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const actions = document.querySelector('.actions');
    if (actions) {
        const cartBtn = document.createElement('a');
        cartBtn.href = 'carrito.html';
        cartBtn.id  = 'cart-btn';
        cartBtn.setAttribute('aria-label', 'Cart');
        cartBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span id="cart-badge">0</span>
        `;
        // Insert before lang-switcher
        const langSwitcher = actions.querySelector('.lang-switcher');
        actions.insertBefore(cartBtn, langSwitcher);
    }
    updateCartBadge();
});
