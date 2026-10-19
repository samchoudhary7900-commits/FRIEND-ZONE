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
            <title>Friend Zone - Dashboard</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; }
                body {
                    font-family: sans-serif;
                    background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
                    background-attachment: fixed;
                    margin: 0; padding: 12px; color: #fff; min-height: 100vh;
                }
                .container { max-width: 420px; margin: 0 auto; padding-bottom: 30px; }
                .card {
                    background: #ffffff; padding: 30px 20px; border-radius: 24px;
                    color: #1f2937; margin-top: 35vh; transform: translateY(-50%);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center;
                }
                input { width: 100%; padding: 14px; margin: 8px 0; border: 1.5px solid #e5e7eb; border-radius: 12px; outline: none; }
                button {
                    width: 100%; padding: 14px; background: linear-gradient(135deg, #a855f7, #ec4899); color: white;
                    border: none; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 12px; font-size: 16px;
                }
                .header { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 16px 0; }
                .avatar { width: 44px; height: 44px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; }
                .coins-badge { background: rgba(255,255,255,0.25); padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; }
                .section-title { font-size: 16px; font-weight: 700; margin: 16px 0 10px 0; }
                .featured-card {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 20px; padding: 16px; color: white; cursor: pointer;
                    display: flex; justify-content: space-between; align-items: center;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }
                .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .game-card {
                    border-radius: 20px; padding: 16px; color: white; cursor: pointer;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.15); min-height: 95px;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .c1 { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
                .c2 { background: linear-gradient(135deg, #ec4899, #be185d); }
                .c3 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
                .c4 { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .game-card h3 { margin: 0; font-size: 15px; font-weight: 700; }
                .game-card span { font-size: 11px; opacity: 0.85; }
                .logout-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 12px; margin-top: 20px; font-weight: bold; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Login View -->
                <div id="login-box" class="card">
                    <h2>Friend Zone</h2>
                    <input type="text" id="username" placeholder="Username (admin)">
                    <input type="password" id="password" placeholder="Password (password123)">
                    <button onclick="handleLogin()">Login</button>
                    <div id="msg" style="color:red; font-size:12px; margin-top:10px;"></div>
                </div>

                <!-- Dashboard View -->
                <div id="dashboard-box" style="display:none;">
                    <div class="header">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div id="user-avatar" class="avatar">A</div>
                            <div>
                                <div id="user-display" style="font-weight:700; font-size:16px;">admin</div>
                                <div style="font-size:11px; color:#e9d5ff;">🟢 Online</div>
                            </div>
                        </div>
                        <div class="coins-badge">🪙 1,500</div>
                    </div>

                    <div class="section-title">Featured Room</div>
                    <div class="featured-card" onclick="alert('VIP Lounge room click ho gaya!')">
                        <div>
                            <h3 style="margin:0; font-size:16px;">🎙️ VIP Voice Lounge</h3>
                            <span style="font-size:12px; opacity:0.9;">Tap to join audio chat</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.25); padding:6px 14px; border-radius:12px; font-size:12px; font-weight:700;">Join</div>
                    </div>

                    <div class="section-title">Game Rooms</div>
                    <div class="game-grid">
                        <div class="game-card c1" onclick="alert('Farm Simulator clicked')">
                           <h3>🌱 Farm Simulator</h3>
                           <span>Multiplayer Voice</span>
                        </div>
                        <div class="game-card c2" onclick="alert('Food Rush clicked')">
                           <h3>🍔 Food Rush</h3>
                           <span>Fast-paced Fun</span>
                        </div>
                        <div class="game-card c3" onclick="alert('Spy clicked')">
                           <h3>🕵️ Who's the Spy</h3>
                           <span>Deduction Game</span>
                        </div>
                        <div class="game-card c4" onclick="alert('Cafe clicked')">
                           <h3>☕ Triclator Cafe</h3>
                           <span>Chill & Talk</span>
                        </div>
                    </div>
                    <button class="logout-btn" onclick="location.reload()">Logout</button>
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
                        document.getElementById('user-avatar').innerText = data.user.charAt(0).toUpperCase();
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
