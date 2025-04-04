import BaseRole from './Base';

export default class Builder extends BaseRole {

  run() {
    const { creep } = this;

    if(this.working && creep.store[RESOURCE_ENERGY] === 0) {
      this.working = false;
      creep.say('🔄 harvest');
    }

    if(!this.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if(this.working) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
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
