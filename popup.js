// Only show once per session
if (!sessionStorage.getItem('promo_seen')) {
    setTimeout(() => {
        const el = document.createElement('div');
        el.id = 'promo-popup';
        el.innerHTML = `
            <button class="promo-close" onclick="closePromo()" aria-label="Close">✕</button>
            <div class="promo-tag">LIMITED OFFER</div>
            <div class="promo-emoji">🤫</div>
            <h2 class="promo-title">psst... don't tell anyone</h2>
            <p class="promo-sub">okay fine, we'll say it once.<br>you get <strong>50% OFF</strong> your first order.</p>
            <p class="promo-fine">no catch. no drama. just subscribe and we'll send you the code.</p>
            <a href="suscribirte.html" class="promo-btn" onclick="closePromo()">claim my 50% off →</a>
            <p class="promo-expire">⏳ expires at midnight. probably.</p>
        `;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
    }, 2000);
}

function closePromo() {
    const el = document.getElementById('promo-popup');
    if (el) { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }
    sessionStorage.setItem('promo_seen', '1');
}
