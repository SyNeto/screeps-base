export default class Upgrader {

  constructor(creep) {
    this.creep = creep;
  }

  run() {
    const { creep } = this;

    if(creep.memory.upgrading && creep.stroe[RESOURCE_ENERGY] === 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if(creep.memory.upgrading) {
      const controller = creep.room.controller;
      if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if(sources.length > 0) {
        if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
      }
    }
  }
} 