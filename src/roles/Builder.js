import BaseRole from './Base';

export default class Builder extends BaseRole {

  run() {
    const { creep } = this;

    if(this.working && creep.store[RESOURCE_ENERGY] === 0) {
      this.working = false;
      this.target = null;
      creep.say('🔄 harvest');
    }

    if(!this.working && creep.store.getFreeCapacity() === 0) {
      this.working = true;
      this.target = null;
      creep.say('🚧 build');
    }

    if(this.working) {
      // building phase
      if (!this.target || this.target.progress == this.target.progressTotal) {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
          this.target = targets[0];
        }
      }
      if (this.target) {
        if (creep.build(this.target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    } else {
      if(!this.target) {
        const sources = creep.room.find(FIND_SOURCES);
        if(sources.length > 0) {
          this.target = sources[0];
        }
      }
      if(this.target) {
        if(creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  }
}
