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
   * @param {String} mapFileName
   */
  getMap(mapFileName) {
    fetch(`${this.server_addr}/map_file/${mapFileName}`).then((data) => {
      data.body.pipe(fs.createWriteStream(`${this.mapDir}/${mapFileName}`));
      this.emitter.emit('mapStored', mapFileName);
    });
  }
}


module.exports = {
  DntpCommunicator,
};
