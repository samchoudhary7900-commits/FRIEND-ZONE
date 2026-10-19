const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            <!-- Stable Agora RTC SDK CDN -->
            <script src="https://download.agora.io/sdk/web/AgoraRTC_N-4.17.0.js"></script>
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
                .voice-btn { background-color: #2b8a3e; }
                .mic-btn { background-color: #f59f00; }
                .leave-btn { background-color: #e03131; }
                .logout-btn { background-color: #888; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div id="login-box" class="card">
                <h2>Friend Zone</h2>
                <input type="text" id="username" placeholder="Username">
                <input type="password" id="password" placeholder="Password">
                <button onclick="handleLogin()">Login</button>
                <div id="message" style="margin-top:10px; color:red;"></div>
            </div>

            <div id="dashboard-box" class="card" style="display:none;">
                <h2>Friend Zone</h2>
                <h3 id="welcome-user">Welcome!</h3>
                <div style="margin:20px 0; padding:10px; background:#e7f5ff; border-radius:8px;">
                    <p id="room-status" style="font-size: 12px; word-break: break-all;">🎙️ Voice Room: Ready</p>
                    <button id="join-btn" class="voice-btn" onclick="joinVoiceRoom()">Join Voice Room</button>
                    <button id="mic-btn" class="mic-btn" style="display:none;" onclick="toggleMic()">Mute Mic</button>
                    <button id="leave-btn" class="leave-btn" style="display:none;" onclick="leaveVoiceRoom()">Leave Room</button>
                </div>
                <button class="logout-btn" onclick="location.reload()">Logout</button>
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
                        document.getElementById('welcome-user').innerText = "Welcome, " + data.user + " 🎉";
                    } else {
                        msg.innerText = data.message;
                    }
                }

                let client, localAudioTrack;
                let isMuted = false;

                async function joinVoiceRoom() {
                    try {
                        if (typeof AgoraRTC === 'undefined') {
                            document.getElementById('room-status').innerText = "❌ Agora SDK failed to load. Check Internet.";
                            return;
                        }

                        document.getElementById('room-status').innerText = "Asking mic permission...";
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        
                        document.getElementById('room-status').innerText = "Connecting Agora...";
                        client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
                        
                        client.on("user-published", async (user, mediaType) => {
                            await client.subscribe(user, mediaType);
                            if (mediaType === "audio") user.audioTrack.play();
                        });

                        await client.join("00000000000000000000000000000000", "friendzone_room", null, null);
                        
                        localAudioTrack = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: stream.getAudioTracks()[0] });
                        await client.publish([localAudioTrack]);

                        document.getElementById('room-status').innerText = "🔊 Connected in Voice Room!";
                        document.getElementById('join-btn').style.display = 'none';
                        document.getElementById('mic-btn').style.display = 'block';
                        document.getElementById('leave-btn').style.display = 'block';
                    } catch (e) {
                        console.error(e);
                        document.getElementById('room-status').innerText = "❌ " + e.name + ": " + e.message;
                    }
                }

                async function toggleMic() {
                    if (!localAudioTrack) return;
                    isMuted = !isMuted;
                    await localAudioTrack.setMuted(isMuted);
                    
                    const micBtn = document.getElementById('mic-btn');
                    if (isMuted) {
                        micBtn.innerText = "Unmute Mic";
                        micBtn.style.backgroundColor = "#2b8a3e";
                        document.getElementById('room-status').innerText = "🔇 Mic Muted";
                    } else {
                        micBtn.innerText = "Mute Mic";
                        micBtn.style.backgroundColor = "#f59f00";
                        document.getElementById('room-status').innerText = "🔊 Connected in Voice Room!";
                    }
                }

                async function leaveVoiceRoom() {
                    if (localAudioTrack) localAudioTrack.close();
                    if (client) await client.leave();
                    isMuted = false;
                    document.getElementById('room-status').innerText = "🎙️ Voice Room: Ready";
                    document.getElementById('join-btn').style.display = 'block';
                    document.getElementById('mic-btn').style.display = 'none';
                    document.getElementById('leave-btn').style.display = 'none';
                    document.getElementById('mic-btn').innerText = "Mute Mic";
                    document.getElementById('mic-btn').style.backgroundColor = "#f59f00";
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
