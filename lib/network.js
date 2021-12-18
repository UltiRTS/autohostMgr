// this file if for autohostManager to communicate with plasmid
const {WebSocketServer} = require('ws');
const {eventEmitter} = require('../emitter');

const allowedActions = [
  'MSGRELAY',
];

/**
 * @class PlasmidCommunicator
 */
class PlasmidCommunicator {
  /**
     *
     * @param {object} config
     */
  constructor(config={
    port: 8080,
  }) {
    this.wss = new WebSocketServer({
      port: config.port,
    });
  }

  /**
   *
   * @param {object} message json format mesage
   */
  msgTrigging(message) {
    if ('action' in message &&
        'parameters' in message &&
        message.action in allowedActions) {
      eventEmitter.emit(message.action, message.parameters);
    }
  }
}

module.exports = {
  PlasmidCommunicator,
};
