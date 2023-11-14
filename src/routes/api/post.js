// src/routes/api/post.js

const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
    const id = crypto.randomUUID().toString('hex');
    const location = req.protocol + '://' + req.hostname + '8080/v1' + req.url + '/' + id;

    res.set({ Location: location});

    const fragment = new Fragment({
      id: id,
      ownerId: req.user,
      created: new Date().toString(),
      updated: new Date().toString(),
      type: req.headers['content-type'],
      size: Number(req.headers['content-length']),

    });

    await fragment.setData(req.body);

    res.status(200).json({
      status: 'ok',
      fragments: fragment,
    });

  }
  else{
    res.status(401).json({
      status: 'error',
      message: 'Error. Invalid fragment.',
    });
  }
};
