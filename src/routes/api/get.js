// src/routes/api/get.js
const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const fragmentList = await Fragment.byUser(user, req.query.expand == 1 ? true : false);

  res.status(200).json({
    status: 'ok',
    fragments: fragmentList,
  });
};
