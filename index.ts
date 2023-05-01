require('dotenv').config();
import connectDB from './config/dbConn';
import mongoose from 'mongoose';
import corsOptions from './config/corsOptions';
import credentials from './middleware/credintials';
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000 ;

connectDB();

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());


// Routes

// Auth route
app.use('/auth' , require('./routes/auth'));

// Board Crud
app.use('/board' , require('./routes/board'));

// Task Crud
app.use('/task' , require('./routes/task'));






mongoose.connection.once('open' , () => {
    console.log('connect to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})