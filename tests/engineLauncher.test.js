
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

const starter = new EngineBridger(process.cwd(), ['cmd1', 'cmd2']);
starter.scriptGen(13000, 2000,
    {
      player1: {
        index: 0,
        isAI: false,
        isChicken: false,
        isSpectator: false,
        team: 0,
      },
      player2: {
        index: 1,
        isAI: false,
        isChicken: false,
        isSpectator: false,
        team: 0,
      },
      gpt_02: {
        index: 2,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 0,
      },
      gpt_13: {
        index: 3,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 0,
      },
      gpt_24: {
        index: 4,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 1,
      },
      gpt_35: {
        index: 5,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 1,
      },
      gpt_46: {
        index: 6,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 1,
      },
      gpt_57: {
        index: 7,
        isAI: true,
        isChicken: false,
        isSpectator: false,
        team: 1,
      },
    }
    , 3, 'mapname');


starter.launchGame();
