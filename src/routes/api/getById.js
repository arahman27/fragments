// src/routes/api/getById.js

const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  let user = crypto.createHash('sha256').update(req.user).digest('hex');
  const idList = await Fragment.byUser(user);
  const textExt = ['md', 'html', 'txt', 'json'];
  const imgExt = ['png', 'jpg', 'webp', 'gif'];

  const splitId = req.params.id.split('.');

  let fragmentId;
  let extension;

  if (splitId.length > 1){
    fragmentId = splitId.slice(0, splitId.length - 1).join('.');
    extension = splitId[splitId.length - 1];

  }
  else{
    fragmentId = req.params.id;
    extension = null;

  }

  console.log('Extension is: ' + extension);

  if(idList.includes(fragmentId)){
    const findFragment = await Fragment.byId(user, fragmentId);
    let data = null;
    let checkExt = 0;

    if (findFragment) {
      if(!extension){
        data = await findFragment.getData();

      }
      else{
        if (findFragment.mimeType.slice(0, 1) === 'a' || findFragment.mimeType.slice(0, 1) === 't'){
          if (textExt.includes(extension)){
            data = await findFragment.getData();
            checkExt = 0;
          
          }
          else{
            checkExt = 1;

          }
        }
        else if (findFragment.mimeType.slice(0, 1) === 'i'){
          if (imgExt.includes(extension)){
            data = await findFragment.getData();  
            checkExt = 0;

          }
          else{
            checkExt = 1;

          }
        }
      }

      if(data && checkExt === 0){
        res.setHeader('Content-Type', findFragment.mimeType);
        res.status(201).send(data);
      }
      else{
        res.status(401).json({
          status: 'error',
          message: 'Cannot convert fragment type.',
        });
      }
    }
  }
  else{
    res.status(401).json({
      status: 'error',
      message: 'No fragments found',
    });
  }
}
