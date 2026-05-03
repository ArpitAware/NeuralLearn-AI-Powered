const Job = require('../models/Job');

exports.getJobs = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    const query = { isActive: true };
    if (type && type !== 'All') query.type = type;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants', 'name avatar');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

exports.applyJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already applied' });
    }
    job.applicants.push(req.user._id);
    await job.save();
    res.json({ success: true, message: 'Application submitted' });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
};
