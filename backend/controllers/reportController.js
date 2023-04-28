const Report = require('../models/report');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create a new report => /api/v1/report/new
exports.newReport = catchAsyncErrors(async (req, res, next) => {
    // Check if user is logged in
    if (!req.user) {
        return next(new ErrorHandler('Please log in to create a report.', 401));
    }
    
    const {
        name,
        email,
        issue,
        description,
        status
    } = req.body;

    const report = await Report.create({
        name,
        email,
        issue,
        description,
        status,
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        user: req.user._id,
        report
    })
})

// Get all reports - ADMIN => /api/v1/admin/reports/
exports.allReports = catchAsyncErrors(async (req, res, next) => {
    const reports = await Report.find()

    res.status(200).json({
        success: true,
        reports
    })
})

// Get single report => /api/v1/report/:id
exports.getSingleReport = catchAsyncErrors(async (req, res, next) => {
    const report = await Report.findById(req.params.id)

    if (!report) {
        return next(new ErrorHandler('No Report found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        report
    })
})
// Get logged in user reports - USER => /api/v1/reports/me
exports.myReports = catchAsyncErrors(async (req, res, next) => {
    // Check if user is logged in
    if (!req.user) {
        return next(new ErrorHandler('Please log in to see your reports.', 401));
    }

    const reports = await Report.find({ user: req.user.id });

    if (reports.length === 0) {
        return next(new ErrorHandler('You have no reports yet.', 404));
    }

    res.status(200).json({
        success: true,
        reports
    });
});



// Delete report => /api/v1/admin/report/:id
exports.deleteReport = catchAsyncErrors(async (req, res, next) => {
    const report = await Report.findById(req.params.id)

    if (!report) {
        return next(new ErrorHandler('No Report found with this ID', 404))
    }

    await Report.deleteOne({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: 'Report is deleted.'
    })
})
// Update report - ADMIN  =>   /api/v1/admin/report/:id
exports.updateReport = catchAsyncErrors(async (req, res, next) => {
    const report = await Report.findById(req.params.id)

    if (!report) {
        return next(new ErrorHandler('No Report found with this ID', 404))
    }

    const { status, message } = req.body;

    if (status && !['Ongoing', 'Resolved', 'Rejected'].includes(status)) {
        return next(new ErrorHandler('Invalid status', 400))
    }

    report.status = status || report.status;
    report.updatedAt = Date.now();

    if (message) {
        report.messages.push({
            message,
            user: req.user._id
        });
    }

    await report.save();

    res.status(200).json({
        success: true,
        user: req.user._id,
        report
    });
});
