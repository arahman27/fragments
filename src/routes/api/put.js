// src/routes/api/put.js

const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idList = await Fragment.byUser(user);

  if(idList.includes(req.params.id)){
    const findFragment = await Fragment.byId(user, req.params.id);

    if (findFragment){
      if (Buffer.isBuffer(req.body) && Fragment.isSupportedType(req.headers['content-type'])) {
        const id = crypto.randomUUID().toString('hex');
        const location = 'http://' + req.headers.host + '/v1/fragments/' + id;

        res.set({ Location: location });

        await findFragment.setData(req.body);

        res.status(201).json({
          status: 'ok',
          fragments: findFragment,
        });

      }
    }
    else{
      res.status(401).json({
        status: 'error',
        message: 'No fragments found',
      });
    }
  }
  else{
    res.status(401).json({
      status: 'error',
      message: 'No fragments found',
    });
  }
}
