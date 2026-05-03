const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, applyJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('admin'), createJob);
router.post('/:id/apply', protect, applyJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
