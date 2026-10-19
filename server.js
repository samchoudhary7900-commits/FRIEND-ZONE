const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Friend Zone</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f4f4f9; }
                h1 { color: #333; }
                p { color: #666; }
            </style>
        </head>
        <body>
            <h1>Welcome to Friend Zone</h1>
            <p>App UI is now loading successfully!</p>
        </body>
        </html>
    `);
});
// Login API route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, message: "Login successful!", user: { username } });
    
