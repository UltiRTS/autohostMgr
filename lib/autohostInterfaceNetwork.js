const dgram = require('dgram');


/**
 * @class AutohostIfNetwork
 */
class AutohostIfNetwork {
  /**
     *
     * @param {Number} port
     * @param {EventEmitter} eventEmitter see `hoster.js`
     * where this constructor is called
     */
  constructor(port, eventEmitter) {
    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      // parse msg into action and parameter,
      // emit back to hoster using eventEmitter
    });

    this.server.on('listening', () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(port);
  }

  /**
   *
   * @param {string} things2send
   * @description message to relay
   */
  send2springEngine(things2send) {
    this.server.send(things2send);
  }
}


module.exports = {
  AutohostIfNetwork,
};
