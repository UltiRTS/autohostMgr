/* eslint-disable max-len */
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
    this.autohostPort = 0;
    // main to hoster event listener
    addEventListener('message', (e) => {
      const action=e.data.action;
      const parameters=e.data.parameters;

      switch (action) {
        case 'startGame': {
          this.startGame(parameters);
          break;
        }
        case 'exitGame': {
          this.exitGame(parameters);
          break;
        }
        case 'midJoin': {
          this.autohostServer.midJoin(parameters);
          break;
        }
      }
    });

    // engine to hoster event listener
    eventEmitter.on('engineMsg', (message)=>{
      // eslint-disable-next-line max-len
      message.parameters.port = this.autohostPort;
      postMessage(JSON.stringify(message)); // plz do not make decisions in autohostmgr, we pass it back to plasmid, which has the access to db
      // eslint-disable-next-line max-len
      // and the decision will be configurable. See main.js: hoster to mgr event listener
    });
    eventEmitter.on('setBattlePort', (port)=>{
      this.autohostPort = port;
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
    const hostPort=2000 + parameters.id;
    const battlePort=6000 + parameters.id;
    const mapName=parameters.map;
    eventEmitter.emit('setBattlePort', battlePort);

    const aiHosters = parameters.aiHosters;
    // eslint-disable-next-line max-len
    this.autohostServer = new AutohostIfNetwork(2000+parameters.id, eventEmitter);
    const engine = new EngineBridger(process.cwd(), ['cmd1', 'cmd2']);
    engine.scriptGen(hostPort, battlePort,
        parameters.team, getAllyTeamCount(), mapName, aiHosters);


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
    try {
      this.autohostServer.send2springEngine('/kill');
    } catch {
      console.log('autohost server not running');
    }
  }
}
new HosterThread();
