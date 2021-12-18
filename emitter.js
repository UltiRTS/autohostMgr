const EventEmitter = require('events');
const {EngineBridger} = require('./lib/engine');

// eventEmitter will only be initialized once
const eventEmitter = new EventEmitter();
// pool of Engine
const pool = [];

// launch game here
eventEmitter.on('createGame', (params) => {
});

module.exports = {
  eventEmitter,
};
