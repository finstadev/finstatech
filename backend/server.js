const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const { pool, init } = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ── SUBSCRIBERS ──────────────────────────────────────────────────────────────

app.post('/api/subscribe', async (req, res) => {
  const { name, email, deals, articles, refurb } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  try {
    await pool.execute(
      'INSERT INTO subscribers (name, email, deals, articles, refurb) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), deals ? 1 : 0, articles ? 1 : 0, refurb ? 1 : 0]
    );
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This email is already subscribed.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/subscribers', async (_req, res) => {
  const [rows] = await pool.execute('SELECT * FROM subscribers ORDER BY created_at DESC');
  res.json(rows);
});

app.delete('/api/subscribers/:id', async (req, res) => {
  await pool.execute('DELETE FROM subscribers WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── CONTACTS ─────────────────────────────────────────────────────────────────

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  await pool.execute(
    'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name.trim(), email.trim().toLowerCase(), subject ? subject.trim() : '', message.trim()]
  );
  res.json({ success: true, message: 'Message received!' });
});

app.get('/api/contacts', async (_req, res) => {
  const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
  res.json(rows);
});

app.delete('/api/contacts/:id', async (req, res) => {
  await pool.execute('DELETE FROM contacts WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── PRODUCTS ──────────────────────────────────────────────────────────────────

app.get('/api/products', async (_req, res) => {
  const [rows] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/products', async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required.' });
  }
  const [result] = await pool.execute(
    'INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), description || '', parseFloat(price), category || '', image_url || '']
  );
  res.json({ success: true, id: result.insertId });
});

app.delete('/api/products/:id', async (req, res) => {
  await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── START ─────────────────────────────────────────────────────────────────────
init().then(() => {
  app.listen(PORT, () => {
    console.log(`\n  ✅  FINSTATECH backend running!`);
    console.log(`  🌐  Site:   http://localhost:${PORT}/index.html`);
    console.log(`  🔧  Admin:  http://localhost:${PORT}/backend/admin.html\n`);
  });
}).catch(err => {
  console.error('  ❌  Database connection failed:', err.message);
  process.exit(1);
});
