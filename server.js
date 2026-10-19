const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test User
const DUMMY_USER = {
    username: "admin",
    password: "password123"
};

// Main Page (Login + Dashboard + Voice Room)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Friend Zone</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!-- Agora RTC SDK -->
            <script src="https://download.agora.io/sdk/web/AgoraRTC_N-4.20.0.js"></script>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    width: 85%;
                    max-width: 350px;
                    text-align: center;
                }
                h2 { color: #1877f2; margin-bottom: 20px; }
                input {
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 14px;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #1877f2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                button.voice-btn {
                    background-color: #2b8a3e;
                }
                button.leave-btn {
                    background-color: #e03131;
                }
                button.logout-btn {
                    background-color: #e4e6eb;
                    color: #050505;
                }
                #message { margin-top: 15px; font-weight: bold; }
                .hidden { display: none; }
                .voice-status {
                    margin: 15px 0;
                    padding: 10px;
                    background-color: #e7f5ff;
                    border-radius: 8px;
                    color: #1971c2;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <!-- LOGIN SECTION -->
            <div id="login-box" class="card">
                <h2>Friend Zone</h2>
                <input type="text" id="username" placeholder="Username">
                <input type="password" id="password" placeholder="Password">
                <button onclick="handleLogin()">Login</button>
                <div id="message"></div>
            </div>

            <!-- DASHBOARD & VOICE ROOM SECTION -->
            <div id="dashboard-box" class="card hidden">
                <h2>Friend Zone</h2>
                <h3 id="welcome-user">Welcome!</h3>
                
                <!-- VOICE ROOM CARD -->
                <div class="voice-status">
                    <p id="room-status">🎙️ Voice Room: Idle</p>
                    <button id="join-btn" class="voice-btn" onclick="joinVoiceRoom()">Join Voice Room</button>
                    <button id="leave-btn" class="leave-btn hidden" onclick="leaveVoiceRoom()">Leave Room</button>
                </div>

                <button class="logout-btn" onclick="handleLogout()">Logout</button>
            </div>

            <script>
                // Agora Configuration (Test App ID)
                const AGORA_APP_ID = "00000000000000000000000000000000"; // Test App ID
                const CHANNEL_NAME = "friendzone_main_room";
                
                let rtc = {
                    client: null,
                    localAudioTrack: null
                };

                async function handleLogin() {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    const msgDiv = document.getElementById('message');

                    msgDiv.style.color = "black";
                    msgDiv.innerText = "Checking...";

                    try {
                        const res = await fetch('/api/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password })
                        });
                        const data = await res.json();

                        if (data.success) {
                            document.getElementById('login-box').classList.add('hidden');
                            document.getElementById('dashboard-box').classList.remove('hidden');
                            document.getElementById('welcome-user').innerText = "Welcome, " + data.user + " 🎉";
                        } else {
                            msgDiv.style.color = "red";
                            msgDiv.innerText = data.message;
                        }
                    } catch (err) {
                        msgDiv.style.color = "red";
                        msgDiv.innerText = "Error connecting to server";
                    }
                }

                async function joinVoiceRoom() {
                    try {
                        document.getElementById('room-status').innerText = "Connecting to Voice Room...";
                        
                        // Initialize Agora Client
                        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
                        
                        // Handle Remote Audio Playback
                        rtc.client.on("user-published", async (user, mediaType) => {
                            await rtc.client.subscribe(user, mediaType);
                            if (mediaType === "audio") {
                                const remoteAudioTrack = user.audioTrack;
                                remoteAudioTrack.play();
                            }
                        });

                        // Join Channel
                        await rtc.client.join(AGORA_APP_ID, CHANNEL_NAME, null, null);
                        
                        // Create and Publish Local Audio (Microphone)
                        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                        await rtc.client.publish([rtc.localAudioTrack]);

                        document.getElementById('room-status').innerText = "🔊 Connected in Voice Room!";
                        document.getElementById('join-btn').classList.add('hidden');
                        document.getElementById('leave-btn').classList.remove('hidden');

                    } catch (error) {
                        console.error(error);
                        document.getElementById('room-status').innerText = "❌ Mic permission or connection failed";
                    }
                }

                async function leaveVoiceRoom() {
                    if (rtc.localAudioTrack) {
                        rtc.localAudioTrack.close();
                    }
                    if (rtc.client) {
                        await rtc.client.leave();
                    }
                    document.getElementById('room-status').innerText = "🎙️ Voice Room: Left";
                    document.getElementById('join-btn').classList.remove('hidden');
                    document.getElementById('leave-btn').classList.add('hidden');
                }

                function handleLogout() {
                    leaveVoiceRoom();
                    document.getElementById('dashboard-box').classList.add('hidden');
                    document.getElementById('login-box').classList.remove('hidden');
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                    document.getElementById('message').innerText = '';
                }
            </script>
        </body>
        </html>
    `);
});

// Login API Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
        res.json({ success: true, message: "Login successful!", user: username });
    } else {
        res.json({ success: false, message: "Invalid Username or Password!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
