const express = require('express')
const router = express.Router();

const {
    newReport,
    getSingleReport,
    myReports,
    allReports,
    updateReport,
    deleteReport
} = require('../controllers/reportController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/report/new').post(isAuthenticatedUser, newReport);

router.route('/report/:id').get(isAuthenticatedUser, getSingleReport);
router.route('/reports/me').get(isAuthenticatedUser, myReports);

router.route('/admin/reports/').get(isAuthenticatedUser, authorizeRoles('admin'), allReports);
router.route('/admin/report/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateReport)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReport);

module.exports = router;
