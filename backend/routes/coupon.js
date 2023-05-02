const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');

const {
  getAdminCoupons,
  newCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors'); // <-- import catchAsyncErrors middleware

router.route('/admin/coupons').get(getAdminCoupons);
router.route('/coupon/:id').get(getSingleCoupon);

router
  .route('/admin/coupon/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), catchAsyncErrors(newCoupon)); // <-- apply catchAsyncErrors middleware to newCoupon controller

router
  .route('/admin/coupon/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), catchAsyncErrors(updateCoupon)) // <-- apply catchAsyncErrors middleware to updateCoupon controller
  .delete(isAuthenticatedUser, authorizeRoles('admin'), catchAsyncErrors(deleteCoupon)); // <-- apply catchAsyncErrors middleware to deleteCoupon controller

router.route('/coupon/apply').post(isAuthenticatedUser, applyCoupon); // <-- applyCoupon already has catchAsyncErrors middleware

router.post('/check', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ name: req.body.couponName });
    if (coupon) {
      res.json({ success: true, coupon });
    } else {
      res.json({ success: false, message: 'Coupon does not exist' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Servver Error' });
  }
});
module.exports = router;