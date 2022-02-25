/* eslint-disable max-len */
const config = require('./config');

const EventEmitter = require('events');
eventEmitter = new EventEmitter();

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
      console.log('startGame');
    case 'killEngine':
      killEngine(parameters);
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
  const title=parameters.title;
  rooms[parameters.id] = worker;
  rooms[parameters.id].postMessage({'action': 'startGame', 'parameters': parameters});
  // hoster to mgr event listener
  worker.addEventListener('message', (e) => {
    // see file: lib/autohostInterfaceNetwork.js
    const message = JSON.parse(e.data);
    message.parameters.roomID = roomID;
    message.parameters.title = title;
    // console.log('autohost interface:');
    console.log(message);
    autohostMgrCltNetwork.send2plasmid(message);
    // seems this variable not used

    // eslint-disable-next-line no-unused-vars
  });
  rooms[parameters.id] = worker;
}

/**
 * @param {object} parameters for game
 */
function killEngine(parameters) {
  rooms[parameters.id]
      .postMessage({'action': 'exitGame', 'parameters': parameters});
}


