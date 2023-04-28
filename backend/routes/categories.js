const express = require('express');
const router = express.Router();

const {
    getAdminCategories,
    newCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoriesController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/admin/categories').get(getAdminCategories);

router.route('/category/:id').get(getSingleCategory);

router.route('/admin/category/new')
    .post(isAuthenticatedUser, authorizeRoles('admin'), newCategory);

router.route('/admin/category/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateCategory)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCategory);

module.exports = router;
