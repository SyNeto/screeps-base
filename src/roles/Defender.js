export default class Defender {
  constructor(creep) {
    this.creep = creep;
  }

  run() {
    const { creep } = this;
    const targets = creep.room.find(FIND_HOSTILE_CREEPS);

    if (targets.length > 0) {
      const target = creep.pos.findClosestByPath(targets);
      if(creep.attack(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
      } else {
        creep.say('⚔️ attack');
      }
    } else {
      const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
      if(spawn && !creep.pos.inRangeTo(spawn, 3)) {
        creep.moveTo(spawn, { visualizePathStyle: { stroke: '#00ff00' } });
      } else {
        creep.say('🚨 patrol');
      }
    }
  }
}
