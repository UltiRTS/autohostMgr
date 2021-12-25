const {WebSocket} = require('ws');

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
    ws.on('open', function open() {
      // ws.send('something');
      console.log('connected to plasmid' );
    });

    ws.on('message', function message(data) {
      eventEmitter.emit('plasmidRequest', JSON.parse(data));
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


module.exports = {
  AutohostMgrCltNetwork,
};
