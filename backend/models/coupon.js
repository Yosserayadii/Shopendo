const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter coupon code'],
        trim: true,
        maxLength: [100, 'coupon name cannot exceed 100 characters']
    },
    somme: {
        type: Number,
        required: [true, 'Please enter coupon somme'],
        maxLength: [5, 'coupon somme cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter coupon description'],
    },
    
})

module.exports = mongoose.model('Coupon', couponSchema);