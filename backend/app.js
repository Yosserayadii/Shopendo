const express = require('express');
const app = express();

// enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
// const dotenv = require('dotenv');
const path = require('path')

const errorMiddleware = require('./middlewares/errors')

const Setting = require('./models/settings');
// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());


// Import all routes
const products = require('./routes/product');
const coupons = require('./routes/coupon');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const couponRoute = require('./routes/coupon');
const settingRoutes = require('./routes/setting');
const categories = require('./routes/categories');
const reports = require('./routes/report');


app.use('/api/v1', products)
app.use('/api/v1', coupons);
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)
app.use('/api/coupon', couponRoute);
app.use('/api/setting', settingRoutes);
app.use('/api/v1', categories);
app.use('/api/v1', reports)


if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app