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
    server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      server.close();
    });

    server.on('message', (msg, rinfo) => {
      // parse msg into action and parameter,
      // emit back to hoster using eventEmitter
    });

    server.on('listening', () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(port);
  }

  /**
   *
   * @param {string} things2send
   * @description message to relay
   */
  send2springEngine(things2send) {
    server.send(things2send);
  }
}


module.exports = {
  AutohostIfNetwork,
};
