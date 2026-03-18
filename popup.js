// Only show once per session
if (!sessionStorage.getItem('promo_seen')) {
    setTimeout(() => {
        const el = document.createElement('div');
        el.id = 'promo-popup';
        el.innerHTML = `
            <button class="promo-close" id="promo-x" onclick="closePromo()" aria-label="Close">✕</button>
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

        // Start sliding around after it appears
        setTimeout(() => startSliding(el), 600);
    }, 10000);
}

function randomPos(el) {
    const pad = 20;
    const maxX = window.innerWidth  - el.offsetWidth  - pad;
    const maxY = window.innerHeight - el.offsetHeight - pad;
    return {
        x: Math.max(pad, Math.floor(Math.random() * maxX)),
        y: Math.max(pad, Math.floor(Math.random() * maxY))
    };
}

function startSliding(el) {
    if (!document.getElementById('promo-popup')) return;

    // Switch from bottom/right to top/left positioning for free movement
    el.style.bottom = 'auto';
    el.style.right  = 'auto';

    let pos = randomPos(el);
    el.style.left = pos.x + 'px';
    el.style.top  = pos.y + 'px';

    let speed = 1800; // ms between moves

    const move = setInterval(() => {
        const popup = document.getElementById('promo-popup');
        if (!popup) { clearInterval(move); return; }
        pos = randomPos(popup);
        popup.style.left = pos.x + 'px';
        popup.style.top  = pos.y + 'px';
    }, speed);

    // Sneaky: when user hovers, dodge away immediately
    el.addEventListener('mouseenter', () => {
        const popup = document.getElementById('promo-popup');
        if (!popup) return;
        const dodge = randomPos(popup);
        popup.style.left = dodge.x + 'px';
        popup.style.top  = dodge.y + 'px';
    });
}

function closePromo() {
    const el = document.getElementById('promo-popup');
    if (el) { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }
    sessionStorage.setItem('promo_seen', '1');
}
