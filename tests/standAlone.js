const launcher = require('../lib/engineLauncher');
const OptionFactory = launcher.OptionFactory;

var game = new OptionFactory("GAME");
var team = new OptionFactory("TEAM");

var ppl = {
    1: 'hello',
    2: undefined
};

game.addFromDict(ppl);
game.addFromInstance(team);

console.log(game.toString());

let starter = new launcher.EngineLauncher();
starter.scriptGen(process.cwd(), 2000, {
    chan: {
        'index': 1,
        'isAI': false,
        'isChicken': false,
        'isSpector': false,
        'isLeader': true,
        'team': 0
    },
    ai: {
        'index': 2,
        'isAI': true,
        'isChicken': false,
        'isSpector': false,
        'isLeader': true,
        'team': 1
    },
    chicken: {
        'index': 3,
        'isAI': false,
        'isChicken': true,
        'isSpector': false,
        'isLeader': false,
        'team': 2
    },
    spectator: {
        'index': 4,
        'isAI': false,
        'isChicken': false,
        'isSpector': true,
        'isLeader': false,
        'team': 2

    }},{map: {mapName: 'somemap'}}, 'username',2);