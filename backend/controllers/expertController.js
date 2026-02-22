const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const experts = await Expert.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const count = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Expert.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seedExperts = async () => {
  const count = await Expert.countDocuments();
  if (count === 0) {
    const experts = [
      { name: 'Dr. Sarah Johnson', category: 'Health', experience: 15, rating: 4.9, bio: 'Board-certified cardiologist with 15 years of experience in heart health and preventive medicine.' },
      { name: 'Michael Chen', category: 'Tech', experience: 10, rating: 4.8, bio: 'Senior Software Architect specializing in scalable systems and cloud infrastructure.' },
      { name: 'Emily Roberts', category: 'Finance', experience: 12, rating: 4.9, bio: 'Certified Financial Planner helping clients achieve their financial goals.' },
      { name: 'James Wilson', category: 'Legal', experience: 20, rating: 4.7, bio: 'Corporate law expert specializing in mergers, acquisitions, and business contracts.' },
      { name: 'Dr. Lisa Park', category: 'Health', experience: 8, rating: 4.8, bio: 'Psychologist specializing in cognitive behavioral therapy and mental wellness.' },
      { name: 'David Kumar', category: 'Tech', experience: 7, rating: 4.6, bio: 'Full-stack developer and tech entrepreneur with expertise in React and Node.js.' },
      { name: 'Amanda Foster', category: 'Education', experience: 10, rating: 4.9, bio: 'Former university professor turned executive coach and career consultant.' },
      { name: 'Robert Taylor', category: 'Business', experience: 25, rating: 4.8, bio: 'Business strategist and executive coach with Fortune 500 experience.' },
    ];
    await Expert.insertMany(experts);
    console.log('✅ Experts seeded successfully');
  }
};  