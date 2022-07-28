/* eslint-disable max-len */
const config = require('./config');

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const {AutohostMgrCltNetwork, downloadMap} = require('./lib/network');
const {DntpCommunicator} = require('./lib/dntpCommunicator');

const autohostMgrCltNetwork = new AutohostMgrCltNetwork(config.plasmidServer, eventEmitter);

const Worker= require('web-worker');
const dntpCommunicator =
  new DntpCommunicator(config.dntpServerAddr, config.localMapDir);

const rooms={};
try {
// plasmid to mgr event listener
  eventEmitter.on('plasmidRequest', async (requestDict)=>{
    console.log(requestDict);
    const action=requestDict.action;
    const parameters=requestDict.parameters;
    switch (action) {
      case 'startGame': {
        // check if map exists
        const mapQuery = await dntpCommunicator.getMapUrlById(parameters.mapId);
        console.log('dntp service response: ', mapQuery);
        if (mapQuery.map=='') {
          autohostMgrCltNetwork.send2plasmid({
            action: 'error',
            parameters: {title: parameters.title,
              info: 'map File Empty Response',
              status: false,
            },
          });
          break;
        }


        parameters.map = mapQuery.map.map_name;
        const res = await downloadMap(mapQuery, config.localMapDir);
        if (res === false) {
          autohostMgrCltNetwork.send2plasmid({
            action: 'error',
            parameters: {
              title: parameters.title,
              info: 'map File Download Failure',
              status: false,
            },
          });
          break;
        }
        console.log(parameters);
        const aiHosterIndex = Object.keys(parameters.team).length;
        parameters.team['aiHoster'] = {
          index: aiHosterIndex,
          isAI: false,
          isChicken: false,
          isSpectator: true,
          team: 0,
        };
        parameters.aiHosters = [aiHosterIndex];

        try {
          newRoom(parameters);
          console.log('startGame');
        } catch (e) {
          autohostMgrCltNetwork.send2plasmid(JSON.stringify({
            action: 'error',
            parameters: {
              title: parameters.title,
              info: 'room Prototype Init Failure',
              status: false,
            },
          }));
        }
        break;
      }

      case 'killEngine': {
        killEngine(parameters);
        break;
      }
      case 'midJoin': {
        rooms[parameters.id]
            .postMessage({'action': 'midJoin', 'parameters': parameters});
        break;
      }
      case 'returnRoom': {
        rooms[parameters.id].terminate();
        break;
      }
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
      console.log('autohost interface:');
      console.log(message);
      autohostMgrCltNetwork.send2plasmid(message);
      // seems this variable not used

      // eslint-disable-next-line no-unused-vars
    });
    rooms[parameters.id] = worker;
  }
} catch (e) {
  // eslint-disable-next-line guard-for-in
  for (room in rooms) {
    message = {
      action: 'serverEnding',
      parameters: {'roomID': room, 'title': [rooms].room.title},
    };
    autohostMgrCltNetwork.send2plasmid(message);
  }
}

/**
 * @param {object} parameters for game
 */
function killEngine(parameters) {
  rooms[parameters.id]
      .postMessage({'action': 'exitGame', 'parameters': parameters});
}
