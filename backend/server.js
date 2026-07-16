require('dotenv').config();                     /*Load environment variables*/

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',                                              // local dev
    'http://nexdesk-frontend-pranjal.apps.ccllab.copycatltd.com',       // OpenShift frontend
    'https://nexdesk-frontend-pranjal.apps.ccllab.copycatltd.com'       // HTTPS version
  ],
  credentials: true
}));                                /*Allows frontend to talk to backend*/

app.use(express.json());                        /*for Express to read JSON data in req.body*/

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//ROUTES                                        /*handles group of related endpoints*/
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/reports', require('./routes/reports'));


app.get('/', (req, res) => {
    res.json({ message: 'NexDesk API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
