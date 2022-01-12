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
    this.emitter = eventEmitter;
    this.leaveReason = {
      0: 'lost connection',
      1: 'left',
      2: 'kicked',
    };
    this.chatMapping = {
      127: 'toAllies',
      126: 'toSpectators',
      125: 'toEveryone',
    };
    this.readyMapping = {
      0: 'not ready',
      1: 'ready',
      2: 'state not changed',
    };

    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      // parse msg into action and parameter,
      // emit back to hoster using eventEmitter
      console.log('===============');
      console.log(msg.length);
      let playerNumber;
      switch (msg[0]) {
        case 0:
          console.log('server has started');
          this.emitter.emit('engineMsg', {
            action: 'serverStarted',
            parameters: {},
          });
          break;
        case 1:
          console.log('server is about to exit');
          this.emitter.emit('engineMsg', {
            action: 'serverEnding',
            parameters: {},
          });
          break;
        case 2:
          console.log('game started');
          this.emitter.emit('engineMsg', {
            action: 'gameStarted',
            parameters: {},
          });
          break;
        case 3:
          console.log('game ended');
          break;
        case 4:
          console.log('infomation msg');
          const info = msg.slice(1, msg.length).toString('ascii');
          this.emitter.emit('engineMsg', {
            action: 'info',
            parameters: {
              info,
            },
          });
          break;
        case 5:
          console.log('warning msg');
          const warning = msg.slice(1, msg.length).toString('ascii');
          this.emitter.emit('engineMsg', {
            action: 'warning',
            parameters: {
              warning,
            },
          });
          break;
        case 10:
          console.log('join game');
          playerNumber = msg[1];
          const playerName = msg.slice(2, msg.length).toString('ascii');
          this.emitter.emit('engineMsg', {
            action: 'joinGame',
            parameters: {
              playerNumber,
              playerName,
            },
          });
          break;
        case 11:
          console.log('leave game');
          playerNumber = msg[1];
          const leaveReason = msg[2];
          this.emitter.emit('engineMsg', {
            action: 'leaveGame',
            parameters: {
              playerNumber,
              leaveReason: this.leaveReason[leaveReason],
            },
          });
          break;
        case 12:
          console.log('ready for game');
          playerNumber = msg[1];
          const state = this.readyMapping[msg[2]];
          this.emitter.emit('engineMsg', {
            action: 'ready',
            parameters: {
              playerNumber,
              state,
            },
          });
          break;
        case 13:
          console.log('chat msg');
          playerNumber = msg[1];
          const destination = this.chatMapping[msg[2]];
          const text = msg.slice(3, msg.length).toString('ascii');
          this.emitter.emit('engineMsg', {
            action: 'chat',
            parameters: {
              playerNumber,
              destination,
              text,
            },
          });
          break;
        case 14:
          console.log('defeat msg');
          playerNumber = msg[1];
          this.emitter.emit('engineMsg', {
            action: 'defeat',
            parameters: {
              playerNumber,
            },
          });
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
