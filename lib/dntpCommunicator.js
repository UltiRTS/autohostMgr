const fs = require('fs');
const {EventEmitter} = require('stream');
const fetch = require('node-fetch');

/**
 * @class DntpCommnicator
 */
class DntpCommunicator {
  /**
   *
   * @param {String} addr server addr
   * @param {String} mapDir server addr
   */
  constructor(addr, mapDir) {
    if (!fs.existsSync(mapDir)) fs.mkdirSync(mapDir);

    this.server_addr = addr;
    this.mapDir = mapDir;
    this.emitter = new EventEmitter();
    this.emitter.on('mapStored', (mapFileName) => {
      console.log(mapFileName, ' is stored');
    });
  }

  /**
   *
   * @param {String} id
   */
  async getMapUrlById(id) {
    const data = await fetch(`${this.server_addr}/maps/${id}`);
    return data.json();
  }
}


module.exports = {
  DntpCommunicator,
};
