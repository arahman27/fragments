// src/routes/api/getInfo.js

/*const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idList = await Fragment.byUser(user);

  if(idList.includes(req.params.id)){
    const findFragment = await Fragment.byId(user, req.params.id);

    if (findFragment) {
      res.status(200).json({
        status: 'ok',
        fragment: findFragment,
      });
    }
  }
  else{
    res.status(401).json({
      status: 'error',
      message: 'No fragments found',
    });
  }
}*/
