const {AutohostIfNetwork} = require('../lib/autohostInterfaceNetwork');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// eslint-disable-next-line no-unused-vars

// this is the prototype that's to be mted
/**
 * @class hosterThread
 */
class HosterThread {
  /**
   * @description simple threading constructor
   */
  constructor() {
    this.autohostServer = null;
    // main to hoster event listener
    addEventListener('message', (e) => {
      const action=e.data.action;
      const parameters=e.data.parameters;

      switch (action) {
        case 'startGame':
          this.startGame(parameters);
        case 'exitGame':
          this.exitGame(parameters);
      }
    });

    // engine to hoster event listener
    eventEmitter.on('engineUDPMSG', (rawUDPMSG)=>{
      let parsedMessage=this.decodeUDPMSG(rawUDPMSG);
      postMessage(parsedMessage) // plz do not make decisions in autohostmgr, we pass it back to plasmid, which has the access to db
      // and the decision will be configurable. See main.js: hoster to mgr event listener
    });
  }

  /**
   *
   * @param {object} parameters
   */
  startGame(parameters) {
    // TODO: generate script and start an udp server
    // let spring to connect to the udp server
    // eslint-disable-next-line max-len
    this.autohostServer = new AutohostIfNetwork(1024+parameters.id, eventEmitter);
  }

  /**
   *
   * @param {object} parameters
   */
  exitGame(parameters) {
    // TODO: send exit commands through the udp server
    // this.autohostServer.send2springEngine(this.encodeUDPMSG(parameters));
  }
}
new HosterThread();
