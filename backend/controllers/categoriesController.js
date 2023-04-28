const Category = require('../models/category');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Create new category   =>   /api/v1/admin/category/new
exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

// Get all categories  =>   /api/v1/admin/categories
exports.getAdminCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});


// Get single category details   =>   /api/v1/category/:id
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// Update Category   =>   /api/v1/admin/category/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return next(new ErrorHandler('Category ID is missing', 400));
  }

  let category = await Category.findById(id);

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  category.set(req.body);
  category = await category.save();

  res.status(200).json({
    success: true,
    category,
  });
});

// Delete Category   =>   /api/v1/admin/category/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id });

  if (!category) {
    return next(new ErrorHandler('Category not found', 404));
  }

  await Category.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Category is deleted.',
  });
});
