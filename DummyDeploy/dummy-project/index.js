const express = require('express');
const app = express();

// Use Azure's port or fallback to 3000
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('May the force be with you!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

