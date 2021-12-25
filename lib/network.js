const {WebSocket} = require('ws');

/**
 * @class AutohostMgrCltNetwork
 */
class AutohostMgrCltNetwork{
  constructor(targetLs){
    this.ws = new WebSocket('ws://'+targetLs);
    ws.on('open', function open() {
      // ws.send('something');
    });

    ws.on('message', function message(data) {
      eventEmitter.emit('plasmidRequest', JSON.parse(data));
    });
  }

  send2plasmid(msg2send){
    this.ws.send(JSON.stringify(msg2send));
  }

}


module.exports = {
  AutohostMgrCltNetwork,
};
