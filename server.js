const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send({ status: "Server is live and running!", app: "Good Company" });
});

// Login API route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, message: "Login successful!", user: { username } });
    } else {
        res.status(400).json({ success: false, message: "Username and password required" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
