import BaseRole from './Base';

export default class Upgrader extends BaseRole {

  run() {
    const { creep } = this;

    if(this.working && creep.stroe[RESOURCE_ENERGY] === 0) {
      this.working = false;
      creep.say('🔄 harvest');
    }
    if(!this.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if(this.working) {
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