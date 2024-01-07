// controllers/tagController.js
const Post = require('../models/postModel');

exports.getTagSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    // Find distinct tags
    const distinctTags = await Post.find({ tags: { $elemMatch: { $regex: new RegExp(query, 'i') } } })
      .distinct('tags');

    // Query the number of posts per tag
    const tagWithCount = await Post.aggregate([
      { $match: { tags: { $elemMatch: { $regex: new RegExp(query, 'i') } } } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
    ]);

    // Combine distinct tags with post count
    const suggestions = distinctTags.map((tag) => {
      const countObj = tagWithCount.find((item) => item._id === tag);
      const count = countObj ? countObj.count : 0;
      return { tag, count };
    });

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
