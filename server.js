const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let db = [];
const dbPath = './db.json';
if (fs.existsSync(dbPath)) db = JSON.parse(fs.readFileSync(dbPath));

function generatePIN() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (db.find(u => u.username === username)) return res.send('Username sudah terdaftar.');
  const pin = generatePIN();
  db.push({ username, password, pin });
  fs.writeFileSync(dbPath, JSON.stringify(db));
  res.redirect('/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.find(u => u.username === username && u.password === password);
  if (!user) return res.send('Login gagal.');
  res.send(`
    <script>
      sessionStorage.setItem('username', '${user.username}');
      sessionStorage.setItem('pin', '${user.pin}');
      location.href='/chat.html';
    </script>
  `);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
