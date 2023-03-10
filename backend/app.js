const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
 const dotenv = require('dotenv');
const path = require('path')
const cors = require('cors');

const errorMiddleware = require('./middlewares/errors')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
dotenv.config({ path: 'backend/config/config.env' })

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());

//setting up cloudinary configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})


// Import all routes

const auth = require('./routes/auth');

app.use('/api/v1', auth)


if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app