const Post = require('../models/Post');

exports.getPosts = async (req, res, next) => {
  try {
    const { search, tag, sort, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (tag) query.tags = tag;
    let sortObj = { createdAt: -1 };
    if (sort === 'popular') sortObj = { likes: -1 };
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find(query).populate('author', 'name avatar role').sort(sortObj).skip(skip).limit(Number(limit)),
      Post.countDocuments(query),
    ]);
    res.json({ success: true, posts, total });
  } catch (err) {
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar role')
      .populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.create({ author: req.user._id, title, content, tags });
    await post.populate('author', 'name avatar role');
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, post: updated });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: !liked });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.comments.push({ user: req.user._id, content: req.body.content });
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.json({ success: true, comments: post.comments });
  } catch (err) {
    next(err);
  }
};
