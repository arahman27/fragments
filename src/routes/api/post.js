// src/routes/api/post.js

const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
    const id = crypto.randomUUID().toString('hex');
    const location = 'http://' + req.headers.host + '/v1/fragments/' + id;

    res.set({ Location: location });

    const fragment = new Fragment({
      id: id,
      ownerId: crypto.createHash('sha256').update(req.user).digest('hex'),
      created: new Date().toString(),
      updated: new Date().toString(),
      type: req.headers['content-type'],
      size: Number(req.headers['content-length']),

    });

    await fragment.setData(req.body);

    res.status(201).json({
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
