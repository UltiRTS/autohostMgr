
// import { WebSocketServer } from 'ws';
const ws=require('ws');
const conf=require('../dev.conf');

const WebSocketServer=ws.WebSocketServer;
/**
 * @function initLobbyServerNetwork
 */
function initLobbyServerNetwork() {
  const wss = new WebSocketServer({port: 8080});
  const allowedLobbyServer=conf['allowedLobbyServer'];
  wss.on('connection', function connection(ws) {
    console.log('AUTHENTICATING CONNECTION'+ws._socket.remoteAddress);
    if (!allowedLobbyServer.includes(ws._socket.remoteAddress)) {
      return;
    }
    console.log('AUTHORIZED LOBBY SERVER CONNECTED');
    ws.on('message', function incoming(message) {
      eventEmitter.emit('commandFromLobbyServer',
          {'client': ws, 'message': json.serialize(message)});
    });

    // console.log('connectionFromClient')
  });
}

module.exports=initLobbyServerNetwork;
