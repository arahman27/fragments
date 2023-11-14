// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
      this.type = '';
      this.id = randomUUID();

      if(ownerId == null || type == null){
        throw new Error();
      }
      else{
        if(Fragment.isSupportedType(type)){
          this.type = type;
        }
        else{
          throw new Error();
        }

        if(typeof size == "string"){
          throw new Error();
        }
        
        if(size < 0){
          throw new Error();
        }

        if(id != null){
          this.id = id;
        }

        this.ownerId = ownerId;
        this.size = size;
        this.created = created || new Date().toString();
        this.updated = updated || new Date().toString();

        this.save();
      }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand)

  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment =  await readFragment(ownerId, id);

    if(!fragment){
      throw new Error;
    }
    else{
      return Promise.resolve(fragment);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);

  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toString();
    return writeFragment(this);

  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);

  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (Buffer.isBuffer(data)){
      this.size = Buffer.byteLength(data);
      this.updated = new Date().toString();
      this.save();

      return writeFragmentData(this.ownerId, this.id, data);

    }
    else{
      throw new Error();

    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type.toString();

  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.type.includes('text/')){
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const arr = [];
    arr.push(contentType.parse(this.type).type);
    return arr;

  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    const validTypes = [
      `text/plain`,
      'text/plain; charset=utf-8',
      `text/markdown`,
      `text/html`,
      `application/json`,
    ];

    if (validTypes.includes(value)){
      return true;
    }
    else{
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
