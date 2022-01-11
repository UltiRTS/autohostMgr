const dgram = require('dgram');
const {abort} = require('process');


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
    this.emitter = eventEmitter;
    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      // parse msg into action and parameter,
      // emit back to hoster using eventEmitter
      console.log('===============');
      console.log(msg);
      switch (msg[0]) {
        case 0:
          console.log('server started');
          this.emitter.emit('engineMsg', {
            action: 'serverStarted',
            parameters: {},
          });
          break;
        case 1:
          console.log('quit msg');
          break;
        case 2:
          console.log('game started');
          break;
        case 3:
          console.log('game over');
          break;
        case 10:
          console.log('join game');
          break;
        case 11:
          console.log('leave game');
          break;
        case 12:
          console.log('ready for game');
          break;
        case 13:
          console.log('chat msg');
          break;
        case 14:
          console.log('defeat msg');
          break;
        case 20:
          console.log('lua script msg');
          break;
      }
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(port);
    console.log(`server bound to port ${port}`);
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
