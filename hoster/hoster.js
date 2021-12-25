const {AutohostIfNetwork} = require('../lib/autohostInterfaceNetwork');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// eslint-disable-next-line no-unused-vars
const hoster = new HosterThread();
// this is the prototype that's to be mted
/**
 * @class hosterThread
 */
class HosterThread {
  /**
   * @description simple threading constructor
   */
  constructor() {
    // main to hoster event listener
    addEventListener('message', (e) => {
      const action=e.data.action;
      const parameters=e.data.parameters;
      switch (action) {
        case 'startGame':
          startGame(parameters);
        case 'exitGame':
          exitGame(parameters);
      }
    });

    // engine to hoster event listener
    eventEmitter.on('engineUDPMSG', (requestDict)=>{
      const action=requestDict.action;
      const parameters=requestDict.parameters;
      switch (action) {
        case 'startGame':
          newRoom(parameters);
        case 'exitGame':
          exitGame(parameters);
      }
    });
  }

  /**
   *
   * @param {object} parameters
   */
  startGame(parameters) {
    // TODO: generate script and start an udp server
    // let spring to connect to the udp server
    autohostServer = new AutohostIfNetwork(1024+parameters.id, eventEmitter);
  }

  /**
   *
   * @param {object} parameters
   */
  exitGame(parameters) {
    // TODO: send exit commands through the udp server
    send2springEngine();
  }
}
