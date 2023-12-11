// src/routes/api/delete.js

const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idList = await Fragment.byUser(user);

  if(idList.includes(req.params.id)){
    await Fragment.delete(user, req.params.id);

    res.status(201).json({
      status: 'ok',
      message: `The fragment was deleted. [ Fragment ID: ${req.params.id} ]`,
    });

  }
  else{
    res.status(401).json({
      status: 'error',
      message: 'No fragments found',
    });
  }
}
