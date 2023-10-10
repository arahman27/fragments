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
  constructor({ id, ownerId, created = Date.now(), updated = Date.now(), type, size = 0 }) {
      this.type = '';
      this.id = randomUUID();

      if(ownerId == null && type == null){
        throw new Error();
      }
      
      if(type === 'text/plain' || type === 'text/plain; charset=utf-8'){
        this.type = type;
      }
      else{
        throw new Error();
      }

      if(isNaN(size)){
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
      this.created = created;
      this.updated = updated;

  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = listFragments(ownerId, expand);

    if (fragments.size == 0){
      return [];
    }
    else{
      return Array.from(fragments.values());
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const res =  readFragment(ownerId, id);
    
    if(res == undefined){
      throw new Error();
    }
    else{
      return res;
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = Date.now();
    writeFragment(this);
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
    if (data == null){
      throw new Error();
    }

    this.size++;
    this.save()

    writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.type === 'text/plain' || this.type === 'text/plain; charset=utf-8'){
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
    return this.mimeType();
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (value === 'text/plain' || value === 'text/plain; charset=utf-8'){
      return true;
    }
    else{
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
