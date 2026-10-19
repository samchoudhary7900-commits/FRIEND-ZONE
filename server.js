const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching so WebView always fetches the latest code
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
            <title>Friend Zone - Modern UI</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
                    background-attachment: fixed;
                    margin: 0;
                    padding: 12px;
                    color: #fff;
                    min-height: 100vh;
                }
                .container {
                    max-width: 420px;
                    margin: 0 auto;
                    padding-bottom: 30px;
                }

                /* Login Card */
                .login-card {
                    background: #ffffff;
                    padding: 30px 20px;
                    border-radius: 24px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    text-align: center;
                    margin-top: 35vh;
                    transform: translateY(-50%);
                    color: #1f2937;
                }
                .login-card h2 { color: #8b5cf6; margin-bottom: 20px; font-size: 24px; }
                .login-card input {
                    width: 100%;
                    padding: 14px;
                    margin: 8px 0;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    outline: none;
                    font-size: 15px;
                }
                .login-card button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #a855f7, #ec4899);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 12px;
                }

                /* Header Styling */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0 16px 0;
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .avatar {
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(8px);
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 18px;
                }
                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                .username-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }
                .status-text {
                    font-size: 11px;
                    color: #e9d5ff;
                    font-weight: 500;
                }
                .coins-badge {
                    background: rgba(255, 255, 255, 0.25);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 13px;
                    color: #ffffff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                /* App Banner */
                .app-banner {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .app-banner h1 {
                    margin: 0;
                    color: #ffffff;
                    font-size: 26px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    text-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                .app-banner p {
                    margin: 4px 0 0 0;
                    color: #f3e8ff;
                    font-size: 13px;
                    opacity: 0.9;
                }

                /* Section Label */
                .section-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 16px 0 10px 0;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }

                /* Featured Card */
                .featured-card {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 20px;
                    padding: 16px;
                    color: white;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .featured-card:active { transform: scale(0.98); }

                /* Game Grid */
                .game-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .game-card {
                    border-radius: 20px;
                    padding: 16px;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 95px;
                }
                .game-card:active { transform: scale(0.96); }
                .card-1 { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
                .card-2 { background: linear-gradient(135deg, #ec4899, #be185d); }
                .card-3 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
                .card-4 { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .card-5 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
                .card-6 { background: linear-gradient(135deg, #10b981, #047857); }

                .game-card h3 { margin: 0; font-size: 15px; font-weight: 700; }
                .game-card span { font-size: 11px; opacity: 0.85; }

                /* Voice Room Drawer */
                #room-drawer {
                    display: none;
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-align: center;
                    margin-top: 18px;
                    color: #1f2937;
                    animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .control-btn {
                    width: 100%;
                    padding: 13px;
                    border: none;
                    border-radius: 14px;
                    font-size: 15px;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .mute-btn { background: #f59e0b; }
                .leave-btn { background: #ef4444; }
                .logout-btn {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    margin-top: 20px;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Login View -->
                <div id="login-box" class="login-card">
                    <h2>Friend Zone</h2>
                    <input type="text" id="username" placeholder="Username (admin)">
                    <input type="password" id="password" placeholder="Password (password123)">
                    <button onclick="handleLogin()">Login</button>
                    <div id="message" style="margin-top:10px; color:#ef4444; font-size:13px;"></div>
                </div>

                <!-- Dashboard View -->
                <div id="dashboard-box" style="display:none;">
                    <div class="header">
                        <div class="user-profile">
                            <div id="user-avatar" class="avatar">A</div>
                            <div class="user-info">
                                <span id="welcome-user" class="username-text">admin</span>
                                <span class="status-text">🟢 Online</span>
                            </div>
                        </div>
                        <div class="coins-badge">🪙 1,500</div>
                    </div>

                    <div class="app-banner">
                        <h1>Friend Zone</h1>
                        <p>Explore voice rooms & play games</p>
                    </div>

                    <div class="section-title">Featured Room</div>
                    <div class="featured-card" onclick="joinVoiceRoom('VIP Voice Lounge')">
                        <div>
                            <h3 style="margin:0; font-size:16px; font-weight:700;">🎙️ VIP Voice Lounge</h3>
                            <span style="font-size:12px; opacity:0.9;">Tap to join audio chat & party</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.25); padding:6px 14px; border-radius:12px; font-size:12px; font-weight:700;">Join</div>
                    </div>

                    <div class="section-title">Game Rooms</div>
                    <div class="game-grid">
                        <div class="game-card card-1" onclick="joinVoiceRoom('Farm Simulator')">
                            <h3>🌱 Farm Simulator</h3>
                            <span>Multiplayer Voice</span>
                        </div>
                        <div class="game-card card-2" onclick="joinVoiceRoom('Food Rush')">
                            <h3>🍔 Food Rush</h3>
                            <span>Fast-paced Fun</span>
                        </div>
                        <div class="game-card card-3" onclick="joinVoiceRoom('Who is the Spy')">
                            <h3>🕵️ Who's the Spy</h3>
                            <span>Deduction Game</span>
                        </div>
                        <div class="game-card card-4" onclick="joinVoiceRoom('Prank Simulator')">
                            <h3>🎭 Prank Simulator</h3>
                            <span>Laugh & Chat</span>
                        </div>
                        <div class="game-card card-5" onclick="joinVoiceRoom('Space Werewolf')">
                            <h3>🚀 Space Werewolf</h3>
                            <span>Strategy & Voice</span>
                        </div>
                        <div class="game-card card-6" onclick="joinVoiceRoom('Triclator Cafe')">
                            <h3>☕ Triclator Cafe</h3>
                            <span>Chill & Talk</span>
                        </div>
                    </div>

                    <!-- Voice Control Overlay -->
                    <div id="room-drawer">
                        <h3 id="active-room-name" style="margin:0 0 6px 0; color:#8b5cf6; font-size:18px;">🎙️ Connected</h3>
                        <p id="room-status" style="font-size:13px; color:#6b7280; margin:0 0 14px 0;">Microphone Active</p>
                        <button id="mic-btn" class="control-btn mute-btn" onclick="toggleMic()">Mute Mic</button>
                        <button class="control-btn leave-btn" onclick="leaveVoiceRoom()">Leave Room</button>
                    </div>

                    <button class="control-btn logout-btn" onclick="location.reload()">Logout</button>
                </div>
            </div>

            <script>
                async function handleLogin() {
                    const u = document.getElementById('username').value;
                    const p = document.getElementById('password').value;
                    const msg = document.getElementById('message');

                    const res = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: u, password: p })
                    });
                    const data = await res.json();

                    if (data.success) {
                        document.getElementById('login-box').style.display = 'none';
                        document.getElementById('dashboard-box').style.display = 'block';
                        document.getElementById('welcome-user').innerText = data.user;
                        document.getElementById('user-avatar').innerText = data.user.charAt(0).toUpperCase();
                    } else {
                        msg.innerText = data.message;
                    }
                }

                let localStream;
                let isMuted = false;

                async function joinVoiceRoom(roomName) {
                    try {
                        document.getElementById('active-room-name').innerText = "🎙️ " + roomName;
                        document.getElementById('room-status').innerText = "Connecting microphone...";
                        document.getElementById('room-drawer').style.display = 'block';
                        
                        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

                        document.getElementById('room-status').innerText = "🔊 Connected in Voice Room!";
                    } catch (e) {
                        console.error(e);
                        document.getElementById('room-status').innerText = "❌ Mic Error: " + (e.message || e);
                    }
                }

                async function toggleMic() {
                    if (!localStream) return;
                    isMuted = !isMuted;
                    localStream.getAudioTracks()[0].enabled = !isMuted;
                    
                    const micBtn = document.getElementById('mic-btn');
                    if (isMuted) {
                        micBtn.innerText = "Unmute Mic";
                        micBtn.style.backgroundColor = "#10b981";
                        document.getElementById('room-status').innerText = "🔇 Mic Muted";
                    } else {
                        micBtn.innerText = "Mute Mic";
                        micBtn.style.backgroundColor = "#f59e0b";
                        document.getElementById('room-status').innerText = "🔊 Connected in Voice Room!";
                    }
                }

                async function leaveVoiceRoom() {
                    if (localStream) {
                        localStream.getTracks().forEach(track => track.stop());
                    }
                    isMuted = false;
                    document.getElementById('room-drawer').style.display = 'none';
                    document.getElementById('room-status').innerText = "Microphone Active";
                    document.getElementById('mic-btn').innerText = "Mute Mic";
                    document.getElementById('mic-btn').style.backgroundColor = "#f59e0b";
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
        res.json({ success: true, message: "Login successful!", user: username });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
