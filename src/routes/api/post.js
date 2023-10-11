// src/routes/api/post.js

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    fragments: req.body,
  });
};
