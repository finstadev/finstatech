const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ── Helpers ──────────────────────────────────────────────────────────────────

// Shared delete handler — removes a record by id from any collection
function deleteById(collection, id) {
  const data = db.load();
  data[collection] = data[collection].filter(r => r.id !== parseInt(id));
  db.save(data);
}

// ── SUBSCRIBERS ──────────────────────────────────────────────────────────────

app.post('/api/subscribe', (req, res) => {
  const { name, email, deals, articles, refurb } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const data = db.load();

  if (data.subscribers.find(s => s.email === email.trim().toLowerCase())) {
    return res.status(409).json({ error: 'This email is already subscribed.' });
  }

  data.subscribers.push({
    id:         db.nextId(data.subscribers),
    name:       name.trim(),
    email:      email.trim().toLowerCase(),
    deals:      Boolean(deals),
    articles:   Boolean(articles),
    refurb:     Boolean(refurb),
    created_at: new Date().toISOString()
  });
  db.save(data);

  res.json({ success: true, message: 'Subscribed successfully!' });
});

app.get('/api/subscribers', (req, res) => {
  res.json(db.load().subscribers.slice().reverse());
});

app.delete('/api/subscribers/:id', (req, res) => {
  deleteById('subscribers', req.params.id);
  res.json({ success: true });
});

// ── CONTACTS ─────────────────────────────────────────────────────────────────

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const data = db.load();
  data.contacts.push({
    id:         db.nextId(data.contacts),
    name:       name.trim(),
    email:      email.trim().toLowerCase(),
    subject:    subject ? subject.trim() : '',
    message:    message.trim(),
    created_at: new Date().toISOString()
  });
  db.save(data);

  res.json({ success: true, message: 'Message received!' });
});

app.get('/api/contacts', (req, res) => {
  res.json(db.load().contacts.slice().reverse());
});

app.delete('/api/contacts/:id', (req, res) => {
  deleteById('contacts', req.params.id);
  res.json({ success: true });
});

// ── PRODUCTS ──────────────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  res.json(db.load().products.slice().reverse());
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category, image_url } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' });
  }

  const data = db.load();
  const product = {
    id:          db.nextId(data.products),
    name:        name.trim(),
    description: description ? description.trim() : '',
    price:       parseFloat(price),
    category:    category ? category.trim() : '',
    image_url:   image_url ? image_url.trim() : '',
    created_at:  new Date().toISOString()
  };
  data.products.push(product);
  db.save(data);

  res.json({ success: true, id: product.id });
});

app.delete('/api/products/:id', (req, res) => {
  deleteById('products', req.params.id);
  res.json({ success: true });
});

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✅  FINSTATECH backend running!`);
  console.log(`  🌐  Site:   http://localhost:${PORT}/index.html`);
  console.log(`  🔧  Admin:  http://localhost:${PORT}/backend/admin.html\n`);
});
