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
            <title>Friend Zone - VIP Lounge</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { box-sizing: border-box; }
                body {
                    font-family: sans-serif;
                    background: linear-gradient(135deg, #a855f7, #ec4899, #3b82f6);
                    background-attachment: fixed;
                    margin: 0; padding: 10px; color: #fff; min-height: 100vh;
                }
                .container { max-width: 420px; margin: 0 auto; padding-bottom: 20px; }
                .card {
                    background: #ffffff; padding: 25px 20px; border-radius: 20px;
                    color: #1f2937; margin-top: 35vh; transform: translateY(-50%);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center;
                }
                input { width: 100%; padding: 12px; margin: 8px 0; border: 1.5px solid #e5e7eb; border-radius: 10px; outline: none; }
                button {
                    width: 100%; padding: 12px; background: linear-gradient(135deg, #a855f7, #ec4899); color: white;
                    border: none; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 15px;
                }
                .header { display: flex; justify-content: space-between; align-items: center; padding: 6px 0 12px 0; }
                .avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; }
                .coins-badge { background: rgba(255,255,255,0.25); padding: 5px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; }
                .section-title { font-size: 15px; font-weight: 700; margin: 12px 0 8px 0; }
                .featured-card {
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 16px; padding: 14px; color: white; cursor: pointer;
                    display: flex; justify-content: space-between; align-items: center;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.15);
                }
                .game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .game-card {
                    border-radius: 16px; padding: 14px; color: white; cursor: pointer;
                    box-shadow: 0 5px 12px rgba(0,0,0,0.15); min-height: 85px;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .c1 { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
                .c2 { background: linear-gradient(135deg, #ec4899, #be185d); }
                .game-card h3 { margin: 0; font-size: 14px; font-weight: 700; }
                .game-card span { font-size: 10px; opacity: 0.85; }
                .logout-btn { width: 100%; padding: 10px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 10px; margin-top: 15px; font-weight: bold; cursor: pointer; }

                /* Room Active Screen */
                #room-screen {
                    display: none; background: #1e1b4b; border-radius: 20px; padding: 15px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.4); border: 1.5px solid rgba(255,255,255,0.15); margin-top: 5px;
                }
                .room-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 10px; }
                .seat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center; margin: 10px 0; }
                .seat { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
                .seat-circle {
                    width: 45px; height: 45px; border-radius: 50%; background: rgba(255,255,255,0.1);
                    border: 2px dashed rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;
                    font-size: 16px; font-weight: bold; color: #fff;
                }
                .seat-circle.occupied { background: linear-gradient(135deg, #8b5cf6, #ec4899); border: 2px solid #34d399; }
                .seat-name { font-size: 10px; color: #d8b4fe; }

                .gift-bar { display: flex; justify-content: space-around; background: rgba(255,255,255,0.1); padding: 6px; border-radius: 10px; margin-bottom: 8px; }
                .gift-btn { background: none; border: none; font-size: 16px; cursor: pointer; }

                .room-chat {
                    background: rgba(0,0,0,0.3); border-radius: 10px; padding: 8px;
                    height: 95px; overflow-y: auto; font-size: 11px; margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px;
                }
                .chat-msg { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; }
                .chat-input-row { display: flex; gap: 6px; }
                .chat-input-row input { flex: 1; padding: 8px; border-radius: 8px; border: none; outline: none; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; margin: 0; }
                .chat-input-row button { padding: 8px 12px; border-radius: 8px; border: none; background: #8b5cf6; color: #fff; font-weight: bold; cursor: pointer; margin: 0; font-size: 11px; width: auto; }

                .room-controls { display: flex; gap: 8px; margin-top: 10px; }
                .control-btn { flex: 1; padding: 10px; border: none; border-radius: 10px; font-size: 12px; font-weight: 700; color: white; cursor: pointer; text-align: center; }
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
                            <div style="display:flex; align-items:center; gap:8px;">
                                <div id="user-avatar" class="avatar">A</div>
                                <div>
                                    <div id="user-display" style="font-weight:700; font-size:15px;">admin</div>
                                    <div style="font-size:10px; color:#e9d5ff;">🟢 Online</div>
                                </div>
                            </div>
                            <div class="coins-badge">🪙 <span id="coin-count">1,500</span></div>
                        </div>

                        <div class="section-title">Featured Room</div>
                        <div class="featured-card" onclick="joinVoiceRoom('VIP Voice Lounge')">
                            <div>
                                <h3 style="margin:0; font-size:15px;">🎙️ VIP Voice Lounge</h3>
                                <span style="font-size:11px; opacity:0.9;">Tap to join audio chat</span>
                            </div>
                            <div style="background:rgba(255,255,255,0.25); padding:5px 12px; border-radius:10px; font-size:11px; font-weight:700;">Join</div>
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
                                <h3 id="active-room-name" style="margin:0; font-size:14px; color:#f3e8ff;">🎙️ Room</h3>
                                <span id="room-status" style="font-size:10px; color:#34d399;">🟢 Connected</span>
                            </div>
                            <span style="background:rgba(255,255,255,0.15); padding:3px 8px; border-radius:6px; font-size:10px;">👥 Live</span>
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

                        <!-- Gift Toolbar -->
                        <div class="gift-bar">
                            <button class="gift-btn" onclick="sendGift('🌹 Rose (50)', 50)">🌹</button>
                            <button class="gift-btn" onclick="sendGift('💖 Heart (100)', 100)">💖</button>
                            <button class="gift-btn" onclick="sendGift('⭐ Star (200)', 200)">⭐</button>
                            <button class="gift-btn" onclick="sendGift('🚀 Rocket (500)', 500)">🚀</button>
                        </div>

                        <!-- Chat Box -->
                        <div id="chat-container" class="room-chat">
                            <div class="chat-msg"><b>System:</b> Welcome to the Voice Room chat! 👋</div>
                        </div>
                        <div class="chat-input-row">
                            <input type="text" id="chat-input" placeholder="Type a message..." onkeypress="handleKeyPress(event)">
                            <button onclick="sendChatMessage()">Send</button>
                        </div>

                        <!-- Controls -->
                        <div class="room-controls">
                            <button id="mic-btn" class="control-btn mute-btn" onclick="toggleMic()">Mute Mic</button>
                            <button class="control-btn leave-btn" onclick="leaveVoiceRoom()">Leave</button>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                let currentUsername = "admin";
                let userCoins = 1500;
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
                        
                        const chatContainer = document.getElementById('chat-container');
                        chatContainer.innerHTML += '<div class="chat-msg"><b>System:</b> ' + currentUsername + ' took Seat ' + seatNum + ' 💺</div>';
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                }

                function sendGift(giftName, cost) {
                    if (userCoins < cost) {
                        alert("Not enough coins!");
                        return;
                    }
                    userCoins -= cost;
                    document.getElementById('coin-count').innerText = userCoins.toLocaleString();

                    const chatContainer = document.getElementById('chat-container');
                    chatContainer.innerHTML += '<div class="chat-msg" style="color:#fde047;"><b>🎁 Gift:</b> ' + currentUsername + ' sent ' + giftName + '!</div>';
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

                function handleKeyPress(e) {
                    if (e.key === 'Enter') {
                        sendChatMessage();
                    }
                }

                function sendChatMessage() {
                    const input = document.getElementById('chat-input');
                    const text = input.value.trim();
                    if (!text) return;

                    const chatContainer = document.getElementById('chat-container');
                    chatContainer.innerHTML += '<div class="chat-msg"><b>' + currentUsername + ':</b> ' + text + '</div>';
                    input.value = '';
                    chatContainer.scrollTop = chatContainer.scrollHeight;
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
