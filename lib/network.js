const {WebSocket} = require('ws');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const crypto = require('crypto');

/**
 * @class AutohostMgrCltNetwork
 */
class AutohostMgrCltNetwork {
  /**
   *
   * @param {object} target format: {host: 'xx:xx:xx:xx', port: 'xxxx'}
   */
  constructor(target) {
    this.ws = new WebSocket('ws://'+target.host + ':' + target.port);
    this.ws.on('open', function open() {
      // ws.send('something');
      console.log('connected to plasmid' );
    });
    this.ws.on('error', function message(data) {
      console.log('network exiting');
    })

    this.ws.on('message', function message(data) {
      eventEmitter.emit('plasmidRequest', JSON.parse(data));
    });
    const mgrSelf = this; 
    this.ws.on('close', function message(data) {
      console.log('network exiting');

    });
    

  }

  /**
   *
   * @param {String} msg2send
   */
  send2plasmid(msg2send) {
    this.ws.send(JSON.stringify(msg2send));
  }
}

const downloadMap = async (mapInfo, mapDir) => {
  const prefix = mapInfo.prefix;
  const mapFileName = mapInfo.map.map_filename;
  const absoluteUrl = path.join(prefix, mapFileName);
  const storePath = path.join(mapDir, mapFileName);

  if (fs.existsSync(storePath) === true) return true;

  const retry = 3;
  while (retry > 0) {
    console.log('downloading map', mapInfo.map.map_name);
    const data = await fetch(absoluteUrl);
    const buffer = await data.buffer();
    fs.writeFileSync(storePath, buffer);

    const hashSum = crypto.createHash('md5').update(buffer).digest('hex');
    if (hashSum === mapInfo.map.map_hash) break;

    console.log('retrying, ', retry);
    retry--;
  }

  if (retry === 0) return false;
  else return true;
};


module.exports = {
  AutohostMgrCltNetwork,
  downloadMap,
};
