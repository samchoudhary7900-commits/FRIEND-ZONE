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
            <title>Friend Zone - WePlay Style</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #fbcfe8, #c084fc, #93c5fd);
                    background-attachment: fixed;
                    margin: 0;
                    padding: 10px;
                    color: #333;
                }
                .container {
                    max-width: 420px;
                    margin: 0 auto;
                    padding-bottom: 40px;
                }
                /* Login Card */
                .login-card {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    text-align: center;
                    margin-top: 40vh;
                    transform: translateY(-50%);
                }
                .login-card h2 { color: #8b5cf6; margin-bottom: 20px; }
                .login-card input {
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    box-sizing: border-box;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    outline: none;
                }
                .login-card button {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #a855f7, #ec4899);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 10px;
                }

                /* WePlay Dashboard Header */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 5px;
                    margin-bottom: 15px;
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .avatar {
                    width: 45px;
                    height: 45px;
                    background: #8b5cf6;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 18px;
                    box-shadow: 0 4px 10px rgba(139,92,246,0.3);
                }
                .coins-badge {
                    background: rgba(255, 255, 255, 0.8);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 14px;
                    color: #d97706;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                }

                /* App Title Banner */
                .app-banner {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .app-banner h1 {
                    margin: 0;
                    color: #fff;
                    font-size: 28px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .app-banner p {
                    margin: 5px 0 0 0;
                    color: #f3e8ff;
                    font-size: 13px;
                }

                /* Section Title */
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 12px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }

                /* Featured Banner Card */
                .featured-card {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 16px;
                    padding: 18px;
                    color: white;
                    margin-bottom: 15px;
                    box-shadow: 0 6px 15px rgba(16, 185, 129, 0.3);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: transform 0.2s;
                }
                .featured-card:active { transform: scale(0.98); }

                /* Game Grid */
                .game-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }
                .game-card {
                    border-radius: 16px;
                    padding: 15px;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    min-height: 80px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s;
                }
                .game-card:active { transform: scale(0.96); }
                .card-1 { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
                .card-2 { background: linear-gradient(135deg, #ec4899, #be185d); }
                .card-3 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
                .card-4 { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .card-5 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
                .card-6 { background: linear-gradient(135deg, #10b981, #047857); }

                .game-card h3 { margin: 0; font-size: 15px; }
                .game-card span { font-size: 11px; opacity: 0.9; }

                /* Active Voice Room Overlay / Drawer */
                #room-drawer {
                    display: none;
                    background: white;
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    text-align: center;
                    margin-top: 15px;
                    animation: fadeIn 0.3s ease-in-out;
                }
                .control-btn {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    color: white;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .mute-btn { background: #f59e0b; }
                .leave-btn { background: #ef4444; }
                .logout-btn { background: #9ca3af; margin-top: 15px; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
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
                    <div id="message" style="margin-top:10px; color:red; font-size:13px;"></div>
                </div>

                <!-- WePlay Dashboard View -->
                <div id="dashboard-box" style="display:none;">
                    <div class="header">
                        <div class="user-profile">
                            <div id="user-avatar" class="avatar">A</div>
                            <div>
                                <h3 id="welcome-user" style="margin:0; color:#fff; font-size:15px;">admin</h3>
                                <span style="font-size:11px; color:#f3e8ff;">Online</span>
                            </div>
                        </div>
                        <div class="coins-badge">🪙 1,500</div>
                    </div>

                    <div class="app-banner">
                        <h1>Friend Zone</h1>
                        <p>Explore voice rooms & fun games</p>
                    </div>

                    <div class="section-title">Featured Room</div>
                    <div class="featured-card" onclick="joinVoiceRoom('VIP Voice Lounge')">
                        <div>
                            <h3 style="margin:0; font-size:16px;">🎙️ VIP Voice Lounge</h3>
                            <span style="font-size:12px; opacity:0.9;">Tap to join audio chat & party</span>
                        </div>
                        <div style="background:rgba(255,255,255,0.2); padding:6px 12px; border-radius:10px; font-size:12px; font-weight:bold;">Join</div>
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

                    <!-- Voice Room Connected Drawer -->
                    <div id="room-drawer">
                        <h3 id="active-room-name" style="margin:0 0 5px 0; color:#8b5cf6;">🎙️ Connected</h3>
                        <p id="room-status" style="font-size: 13px; color:#4b5563; margin-bottom:15px;">Microphone Active</p>
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
