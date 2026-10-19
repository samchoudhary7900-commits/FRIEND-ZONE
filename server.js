const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test User (Username: admin, Password: password123)
const DUMMY_USER = {
    username: "admin",
    password: "password123"
};

// 1. Home / Login UI Page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Friend Zone - Login</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                .login-card {
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
                button:hover { background-color: #166fe5; }
                #message { margin-top: 15px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="login-card">
                <h2>Friend Zone</h2>
                <input type="text" id="username" placeholder="Username">
                <input type="password" id="password" placeholder="Password">
                <button onclick="handleLogin()">Login</button>
                <div id="message"></div>
            </div>

            <script>
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
                            msgDiv.style.color = "green";
                            msgDiv.innerText = "Login Successful! Welcome " + data.user;
                        } else {
                            msgDiv.style.color = "red";
                            msgDiv.innerText = data.message;
                        }
                    } catch (err) {
                        msgDiv.style.color = "red";
                        msgDiv.innerText = "Error connecting to server";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// 2. Login API Route
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
