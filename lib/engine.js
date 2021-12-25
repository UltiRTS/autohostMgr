const fs = require('fs');
const {spawn} = require('child_process');

/**
 * @class OptionFactory
 * @description see https://github.com/spring/spring/blob/105.0/doc/StartScriptFormat.txt
 */
class OptionFactory {
  header = '';
  option = '';
  /**
   *
   * @param {String} header
   */
  constructor(header) {
    this.header = '['+ header + ']';
    this.option = '';
  }

  /**
   *
   * @param {object} dict of key-value pairs
   */
  addFromDict(dict) {
    for (const [k, v] of Object.entries(dict)) {
      if (v && k) {
        this.option += String(k) + '=' + String(v) + ';\n';
      }
    }
  }

  /**
   *
   * @param {OptionFactory} ins instance of OptionFactory
   */
  addFromInstance(ins) {
    this.option += '\n' + ins.toString() + '\n';
  }

  /**
   *
   * @return {String}
   */
  toString() {
    return this.header + '\n{\n' + this.option + '}';
  }
}


/**
 * @class EngineLauncher
 */
class EngineBridger {
  engine = null;
  startDir = process.cwd();
  username = 'default';
  cmds = null;
  /**
   * @param {String} startDir
   * @param {String} username
   * @param {Array} cmds
   * @description simple constructor
   */
  constructor(startDir, username, cmds) {
    this.teamPtr = 0;
    if(startDir === '' || startDir === undefined) startDir = process.cwd();
    else this.startDir = startDir;
    this.username = username;
    this.cmds = cmds;
  }

  /**
   *
   * @param {*} battlePort
   * @param {*} players
   * @param {*} numTeams
   */
  scriptGen(battlePort, players, numTeams, mapName) {
    this.battlePort = battlePort;
    this.players = players;
    this.numTeams = numTeams;
    // TODO: unit sync

    const game = new OptionFactory('GAME');
    game.addFromDict({
      Mapname: mapName, // TODO unit sync
    });


    // player gen
    Object.keys(this.players).forEach((id) => {
      if (this.players[id]['isAI'] || this.players[id]['isChicken']) return;

      const pl = new OptionFactory('PLAYER' +
       String(this.players[id]['index']),
      );
      if (this.players[id]['isSpector']) {
        pl.addFromDict({
          Name: id,
          Spectator: 1,
          Team: this.players[id]['index'],
          CountryCode: '??',
          Rank: 0,
          Skill: '(10)',
        });
      } else {
        pl.addFromDict({
          Name: id,
          Spectator: 0,
          Team: this.players[id]['index'],
          CountryCode: '??',
          Rank: 0,
          Skill: '(10)',
        });
      }

      game.addFromInstance(pl);
    });

    // AI and Chicken
    let defaultLeader = 0; // default leader 0
    Object.keys(this.players).forEach((id)=>{
      if (this.players[id]['isLeader']) {
        defaultLeader = this.players[id]['index'];
      }
    });

    Object.keys(this.players).forEach((id)=>{
      if (this.players[id]['isAI']) {
        const ai = new OptionFactory('AI' + this.players[id]['index']);
        ai.addFromDict({
          ShortName: 'CircuitAI',
          Name: 'CircuitAI',
          Team: this.players[id]['index'],
          Host: defaultLeader,
        });
        game.addFromInstance(ai);
      } else if (this.players[id]['isChicken']) {
        const ai = new OptionFactory('AI' + this.players[id]['index']);
        ai.addFromDict({
          ShortName: 'Chicken: CircuitAI',
          Name: 'CChicken: ircuitAI',
          Team: this.players[id]['index'],
          Host: defaultLeader,
        });
        game.addFromInstance(ai);
      }
    });

    // team gen
    Object.keys(this.players).forEach((id)=>{
      if (this.players[id]['isAI'] || this.players[id]['isChicken']) {
        const team = new OptionFactory('TEAM' + this.teamPtr);
        team.addFromDict({
          AllyTeam: this.players[id]['team'],
          Side: 'Arm',
          Handicap: 0,
          TeamLeader: defaultLeader,
        });
        game.addFromInstance(team);
      } else {
        const team = new OptionFactory('TEAM' + this.teamPtr);
        team.addFromDict({
          AllyTeam: this.players[id]['team'],
          Side: 'Arm',
          Handicap: 0,
          // the player themselves is the team leader
          TeamLeader: this.players[id]['index'],
        });
        game.addFromInstance(team);
      }

      this.teamPtr++;
    });

    this.teamPtr = 0;

    // team gen
    while (this.teamPtr < this.numTeams) {
      const allyTeam = new OptionFactory('ALLYTEAM' + this.teamPtr);
      allyTeam.addFromDict({NumAllies: 0});
      game.addFromInstance(allyTeam);
      this.teamPtr++;
    }

    this.teamPtr = 0;

    // NON-user set SETTINGS ARE OUT OF INTERPETER LOOP
    // GAME SELECTOR MODULE

    console.log('game type is zk');
    game.addFromDict({GameType: 'mod.sdd'});


    // startposi selector MODULE
    console.log('start position is   startpostype=2;');
    game.addFromDict({startpostype: 2});

    // autohost ident MODULE
    game.addFromDict({'hosttype': 'SPADS'});
    console.log('autohost is   hosttype=SPADS;');

    // autohost ip MODULE
    game.addFromDict({'HostIP': ''});
    console.log('AUTOHOST IP is HostIP=;');

    // host port MODULE
    game.addFromDict({'HostPort': this.battlePort});
    console.log('HOST port is '+this.battlePort);

    // autohost usr MODULE
    game.addFromDict({
      AutoHostName: 'GGFrog',
      AutoHostCountryCode: '??',
      AutoHostRank: 0,
      AutoHostAccountId: 1024,
      IsHost: 1,
    });

    // autohost port
    game.addFromDict({
      AutoHostPort: this.battlePort,
    });
    console.log('AUTOHOST port is ', this.battlePort);

    // restriction gen
    console.log('AUTOHOST NumRestriction=0;');
    game.addFromDict({NumRestriction: 0});

    const restrict = new OptionFactory('RESTRICT');
    game.addFromInstance(restrict);

    // MOD OPTION
    const modeoptions = new OptionFactory('MODEOPTIONS');
    game.addFromInstance(modeoptions);

    // MAP OPTIOn
    const mapop = new OptionFactory('MAPOPTIONS');
    game.addFromInstance(mapop);

    fs.writeFileSync('/tmp/battle' + this.battlePort + '.txt', game.toString());
  }

  /**
   * @description launch game
   */
  launchGame() {
    this.engine =
      spawn(`"engine/spring-dedicated.exe /tmp/battle${this.battlePort}.txt"`);

    this.engine.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    this.engine.stderr.on('data', (data) => {
      console.log(data.toString());
    });
  }

  /**
   *
   * @return {object} isalive
   */
  engineStatus() {
    return {
      isAlive: true,
    };
  }
}

module.exports = {
  OptionFactory,
  EngineBridger,
};