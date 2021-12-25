
const {EngineBridger, OptionFactory} = require('../lib/engine');

const game = new OptionFactory('GAME');
const team = new OptionFactory('TEAM');

const ppl = {
  1: 'hello',
  2: undefined,
};

game.addFromDict(ppl);
game.addFromInstance(team);

console.log(game.toString());

const starter = new EngineBridger(process.cwd(), 'test', ['cmd1', 'cmd2']);
starter.scriptGen(2000, {
  chan: {
    'index': 0,
    'isAI': false,
    'isChicken': false,
    'isSpector': false,
    'isLeader': true,
    'team': 0,
  },
  ai: {
    'index': 1,
    'isAI': true,
    'isChicken': false,
    'isSpector': false,
    'isLeader': false,
    'team': 1,
  },
  chicken: {
    'index': 2,
    'isAI': false,
    'isChicken': true,
    'isSpector': false,
    'isLeader': false,
    'team': 2,
  },
  spectator: {
    'index': 3,
    'isAI': false,
    'isChicken': false,
    'isSpector': true,
    'isLeader': false,
    'team': 2,

  },
  chan1: {
    'index': 4,
    'isAI': false,
    'isChicken': false,
    'isSpector': false,
    'isLeader': true,
    'team': 1,
  },
}, 3, 'somemap');
