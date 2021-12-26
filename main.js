const config = require('./config');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const {AutohostMgrCltNetwork} = require('./lib/network');
const autohostMgrCltNetwork = new AutohostMgrCltNetwork(config.plasmidServer);

const Worker= require('web-worker');

const rooms={};

// plasmid to mgr event listener
eventEmitter.on('plasmidRequest', (requestDict)=>{
  const action=requestDict.action;
  const parameters=requestDict.parameters;
  switch (action) {
    case 'startGame':
      newRoom(parameters);
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
  const worker = new Worker('./hoster.js');
  rooms[parameters.id]
      .postMessage({'action': 'startGame', 'parameters': parameters});
  // hoster to mgr event listener
  worker.addEventListener('message', (e) => {
    const action=e.data.action;
    const parameters=e.data.parameters;
    // seems this variable not used

    // eslint-disable-next-line no-unused-vars
    const roomID=parameters.id;
    switch (action) {
      case 'gameEnded':
        autohostMgrCltNetwork.send2plasmid(
            {'action': 'gameEnded', 'parameters': parameters});
      case 'sayChat':
        autohostMgrCltNetwork.send2plasmid(
            {'action': 'sayChat', 'parameters': parameters});
    }
  });
  rooms[parameters.id] = worker;
}

/**
 * @function exitGame
 */
function exitGame() {
  rooms[parameters.id]
      .postMessage({'action': 'exitGame', 'parameters': parameters});
}


