const express = require('express')
const router = express.Router();


const {
    
    getAdminCoupons,
    newCoupon,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon
    

} = require('../controllers/couponController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');




router.route('/admin/coupons').get(getAdminCoupons);
router.route('/coupon/:id').get(getSingleCoupon);

router.route('/admin/coupon/new').post(isAuthenticatedUser, authorizeRoles('admin'), newCoupon);

router.route('/admin/coupon/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateCoupon)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCoupon);




module.exports = router;