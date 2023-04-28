const Coupon = require('../models/coupon')

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

// Create new coupon   =>   /api/v1/admin/coupon/new
exports.newCoupon = catchAsyncErrors(async (req, res, next) => {

    const coupon = await Coupon.create(req.body);

    res.status(201).json({
        success: true,
        coupon
    })
})




// Get all coupons (Admin)  =>   /api/v1/admin/coupons
exports.getAdminCoupons = catchAsyncErrors(async (req, res, next) => {

    const coupons = await Coupon.find();

    res.status(200).json({
        success: true,
        coupons
    })

})

// Get single coupon details   =>   /api/v1/coupon/:id
exports.getSingleCoupon = catchAsyncErrors(async (req, res, next) => {

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorHandler('coupon not found', 404));
    }


    res.status(200).json({
        success: true,
        coupon
    })

})

// Update Coupon   =>   /api/v1/admin/coupon/:id
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {

    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        return next(new ErrorHandler('coupon not found', 404));
    }

    



    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        coupon
    })

})

// Delete Coupon   =>   /api/v1/admin/coupon/:id
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {

    const coupon = await Coupon.findOne({_id: req.params.id});

    if (!coupon) {
        return next(new ErrorHandler('Coupon not found', 404));
    }

    

    await Product.deleteOne({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: 'Coupon is deleted.'
    })

})


