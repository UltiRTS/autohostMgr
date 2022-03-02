const config = require('./config');

const EventEmitter = require('events');
eventEmitter = new EventEmitter();

const {AutohostMgrCltNetwork, downloadMap} = require('./lib/network');
const {DntpCommunicator} = require('./lib/dntpCommunicator');
const autohostMgrCltNetwork = new AutohostMgrCltNetwork(config.plasmidServer);

const Worker= require('web-worker');
const dntpCommunicator =
  new DntpCommunicator(config.dntpServerAddr, config.localMapDir);

const rooms={};

// plasmid to mgr event listener
eventEmitter.on('plasmidRequest', async (requestDict)=>{
  const action=requestDict.action;
  const parameters=requestDict.parameters;
  switch (action) {
    case 'startGame':
      // check if map exists
      const mapQuery = await dntpCommunicator.getMapUrlById(parameters.mapId);
      if (mapQuery.error !== undefined) {
        autohostMgrCltNetwork.send2plasmid({
          'error': 'map not found',
        });
        break;
      }

      const res = downloadMap(mapQuery, config.localMapDir);
      if (res === false) {
        autohostMgrCltNetwork.send2plasmid({
          'error': 'map download failed',
        });
        break;
      }

      try {
        newRoom(parameters);
        console.log('startGame');
      } catch (e) {
        autohostMgrCltNetwork.send2plasmid(JSON.stringify({
          'action': 'startGame',
          'error': 'unknown error',
        }));
      }
    case 'exitGame':
      exitGame(parameters);
  }
});

// helper function
/**
 *
 * @param {object} parameters
 */
function newRoom(parameters) {
  const worker = new Worker('./hoster/hoster.js');
  const roomID=parameters.id;
  rooms[parameters.id] = worker;
  rooms[parameters.id]
      .postMessage({'action': 'startGame', 'parameters': parameters});
  // hoster to mgr event listener
  worker.addEventListener('message', (e) => {
    // see file: lib/autohostInterfaceNetwork.js
    const message = e.data;
    message.battle = roomID;

    autohostMgrCltNetwork.send2plasmid(JSON.stringify(message));
    // seems this variable not used

    // eslint-disable-next-line no-unused-vars
  });
  rooms[parameters.id] = worker;
}

/**
 * @param {object} parameters for game
 */
function exitGame(parameters) {
  rooms[parameters.id]
      .postMessage({'action': 'exitGame', 'parameters': parameters});
}


