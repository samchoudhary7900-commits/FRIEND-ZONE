const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Cache-Control header disable karna real-time updates ke liye
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// JSON data parse karne ke liye
app.use(express.json());

// Public folder se HTML/CSS/JS files serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server status check route
app.get('/health', (req, res) => {
    res.status(200).send('Server is running fine!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
