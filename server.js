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
            <title>Friend Zone - Voice Room</title>
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
                .game-card h3 { margin: 0; font-size: 15px; font-weight: 700; }
                .game-card span { font-size: 11px; opacity: 0.85; }
                .logout-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 12px; margin-top: 20px; font-weight: bold; cursor: pointer; }

                /* Room Active Screen */
                #room-screen {
                    display: none; background: #1e1b4b; border-radius: 24px; padding: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.4); border: 1.5px solid rgba(255,255,255,0.15); margin-top: 10px;
                }
                .room-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 15px; }
                .seat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; margin: 20px 0; }
                .seat { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
                .seat-circle {
                    width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.1);
                    border: 2px dashed rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;
                    font-size: 20px; font-weight: bold; color: #fff;
                }
                .seat-circle.occupied { background: linear-gradient(135deg, #8b5cf6, #ec4899); border: 2px solid #34d399; }
                .seat-name { font-size: 12px; color: #d8b4fe; }
                .room-controls { display: flex; gap: 10px; margin-top: 20px; }
                .control-btn { flex: 1; padding: 12px; border: none; border-radius: 12px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; text-align: center; }
                .mute-btn { background: #f59e0b; }
                .leave-btn { background: #ef4444; }
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
                    <div id="main-lobby">
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
                        <div class="featured-card" onclick="joinVoiceRoom('VIP Voice Lounge')">
                            <div>
                                <h3 style="margin:0; font-size:16px;">🎙️ VIP Voice Lounge</h3>
                                <span style="font-size:12px; opacity:0.9;">Tap to join audio chat</span>
                            </div>
                            <div style="background:rgba(255,255,255,0.25); padding:6px 14px; border-radius:12px; font-size:12px; font-weight:700;">Join</div>
                        </div>

                        <div class="section-title">Game Rooms</div>
                        <div class="game-grid">
                            <div class="game-card c1" onclick="joinVoiceRoom('Farm Simulator')">
                               <h3>🌱 Farm Simulator</h3>
                               <span>Multiplayer Voice</span>
                            </div>
                            <div class="game-card c2" onclick="joinVoiceRoom('Food Rush')">
                               <h3>🍔 Food Rush</h3>
                               <span>Fast-paced Fun</span>
                            </div>
                        </div>
                        <button class="logout-btn" onclick="location.reload()">Logout</button>
                    </div>

                    <!-- Active Voice Room Screen -->
                    <div id="room-screen">
                        <div class="room-header">
                            <div>
                                <h3 id="active-room-name" style="margin:0; font-size:16px; color:#f3e8ff;">🎙️ Room</h3>
                                <span id="room-status" style="font-size:11px; color:#34d399;">🟢 Connected</span>
                            </div>
                            <span style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:10px; font-size:12px;">👥 Live</span>
                        </div>

                        <!-- Speaker Seats -->
                        <div class="seat-grid">
                            <div class="seat">
                                <div id="seat-1" class="seat-circle occupied">A</div>
                                <span id="seat-1-name" class="seat-name">admin (You)</span>
                            </div>
                            <div class="seat" onclick="claimSeat(2)">
                                <div id="seat-2" class="seat-circle">🎙️</div>
                                <span id="seat-2-name" class="seat-name">Seat 2</span>
                            </div>
                            <div class="seat" onclick="claimSeat(3)">
                                <div id="seat-3" class="seat-circle">🎙️</div>
                                <span id="seat-3-name" class="seat-name">Seat 3</span>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="room-controls">
                            <button id="mic-btn" class="control-btn mute-btn" onclick="toggleMic()">Mute Mic</button>
                            <button class="control-btn leave-btn" onclick="leaveVoiceRoom()">Leave Room</button>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                let currentUsername = "admin";
                let localStream;
                let isMuted = false;

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
                        currentUsername = data.user;
                        document.getElementById('login-box').style.display = 'none';
                        document.getElementById('dashboard-box').style.display = 'block';
                        document.getElementById('user-display').innerText = currentUsername;
                        document.getElementById('user-avatar').innerText = currentUsername.charAt(0).toUpperCase();
                        document.getElementById('seat-1').innerText = currentUsername.charAt(0).toUpperCase();
                        document.getElementById('seat-1-name').innerText = currentUsername + " (You)";
                    } else {
                        msg.innerText = data.message;
                    }
                }

                async function joinVoiceRoom(roomName) {
                    try {
                        document.getElementById('active-room-name').innerText = "🎙️ " + roomName;
                        document.getElementById('main-lobby').style.display = 'none';
                        document.getElementById('room-screen').style.display = 'block';
                        document.getElementById('room-status').innerText = "Connecting mic...";
                        
                        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        document.getElementById('room-status').innerText = "🟢 Connected";
                    } catch (e) {
                        console.error(e);
                        document.getElementById('room-status').innerText = "❌ Mic Error";
                    }
                }

                function claimSeat(seatNum) {
                    const seatCircle = document.getElementById('seat-' + seatNum);
                    const seatName = document.getElementById('seat-' + seatNum + '-name');
                    
                    if (!seatCircle.classList.contains('occupied')) {
                        seatCircle.classList.add('occupied');
                        seatCircle.innerText = currentUsername.charAt(0).toUpperCase();
                        seatName.innerText = currentUsername + " (Seat " + seatNum + ")";
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
                        document.getElementById('room-status').innerText = "🔇 Muted";
                    } else {
                        micBtn.innerText = "Mute Mic";
                        micBtn.style.backgroundColor = "#f59e0b";
                        document.getElementById('room-status').innerText = "🟢 Connected";
                    }
                }

                async function leaveVoiceRoom() {
                    if (localStream) {
                        localStream.getTracks().forEach(track => track.stop());
                    }
                    isMuted = false;
                    document.getElementById('room-screen').style.display = 'none';
                    document.getElementById('main-lobby').style.display = 'block';
                    document.getElementById('room-status').innerText = "🟢 Connected";
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
        res.json({ success: true, user: username });
    } else {
        res.json({ success: false, message: "Invalid credentials!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
