const {AutohostIfNetwork} = require('../lib/autohostInterfaceNetwork');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const EngineBridger = require('../lib/engine').EngineBridger;


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
      const parsedMessage=this.decodeUDPMSG(rawUDPMSG);
      // eslint-disable-next-line max-len
      postMessage(parsedMessage); // plz do not make decisions in autohostmgr, we pass it back to plasmid, which has the access to db
      // eslint-disable-next-line max-len
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
    console.log('game config: ', parameters);
    const hostPort=2000+parameters.id;
    const battlePort=6000+parameters.id;
    const mapName=parameters.map;
    // eslint-disable-next-line max-len
    this.autohostServer = new AutohostIfNetwork(2000+parameters.id, eventEmitter);
    const engine = new EngineBridger(process.cwd(), ['cmd1', 'cmd2']);
    engine.scriptGen(hostPort, battlePort,
        parameters.team, getAllyTeamCount(), mapName);


    engine.launchGame();
    /**
     * @return {int} how many unique teams there are
     */
    function getAllyTeamCount() {
      const teams= new Set();
      // eslint-disable-next-line guard-for-in
      for (const player in parameters.team) {
        teams.add(parameters.team[player].team);
      }
      return teams.size;
    }
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
