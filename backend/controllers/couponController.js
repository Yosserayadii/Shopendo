const Coupon = require('../models/coupon')
const Order = require('../models/order');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.applyCoupon = catchAsyncErrors(async (req, res, next) => {
    const { orderId, couponName } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
    const coupon = await Coupon.findOne({ name: couponName });
    if (!coupon) {
      return next(new ErrorHandler('Invalid coupon code', 400));
    }
    if (order.couponName === couponName) {
      return next(new ErrorHandler('Coupon code has already been applied', 400));
    }
    order.couponName = couponName;
    order.couponAmount = coupon.discountAmount;
    order.totalAmount = order.totalAmount - coupon.discountAmount;
    await order.save();
    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      order,
    });
  });
  
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
    await Coupon.deleteOne({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: 'Coupon is deleted.'
    })

})


