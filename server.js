const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

const DUMMY_USER = {
    username: "admin",
    password: "password123"
};

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Friend Zone</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: sans-serif;
                    background: linear-gradient(135deg, #a855f7, #ec4899);
                    margin: 0; padding: 20px; color: #fff; min-height: 100vh;
                }
                .container { max-width: 400px; margin: 0 auto; text-align: center; }
                .card {
                    background: #ffffff; padding: 30px; border-radius: 20px;
                    color: #1f2937; margin-top: 30vh; transform: translateY(-50%);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ccc; border-radius: 8px; }
                button {
                    width: 100%; padding: 12px; background: #8b5cf6; color: white;
                    border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div id="login-box" class="card">
                    <h2>Friend Zone Login</h2>
                    <input type="text" id="username" placeholder="Username (admin)">
                    <input type="password" id="password" placeholder="Password (password123)">
                    <button onclick="handleLogin()">Login</button>
                    <div id="msg" style="color:red; font-size:12px; margin-top:10px;"></div>
                </div>

                <div id="dashboard-box" style="display:none; margin-top: 50px;">
                    <h2>Welcome, <span id="user-display"></span>! 🎉</h2>
                    <p>Login successfully ho gaya hai!</p>
                    <button onclick="location.reload()">Logout</button>
                </div>
            </div>

            <script>
                async function handleLogin() {
                    const u = document.getElementById('username').value;
                    const p = document.getElementById('password').value;
                    const msg = document.getElementById('msg');

                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: u, password: p })
                    });
                    const data = await res.json();

                    if (data.success) {
                        document.getElementById('login-box').style.display = 'none';
                        document.getElementById('dashboard-box').style.display = 'block';
                        document.getElementById('user-display').innerText = data.user;
                    } else {
                        msg.innerText = data.message;
                    }
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
        res.json({ success: true, user: username });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
