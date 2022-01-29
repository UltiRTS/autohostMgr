const {DntpCommunicator} = require('../lib/dntpCommunicator');
const {dntpServerAddr} = require('../config');

const client = new DntpCommunicator(dntpServerAddr, './maps');

client.getMap('a.sd7');
