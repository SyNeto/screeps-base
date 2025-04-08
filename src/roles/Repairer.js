import BaseRole from "./Base";


export default class Repairer extends BaseRole {
  resourceType = RESOURCE_ENERGY;
  validStructures = [
    STRUCTURE_ROAD,
    STRUCTURE_CONTAINER,
    STRUCTURE_RAMPART,
    STRUCTURE_WALL
  ];

  run() {
    const { creep } = this;

    if (this.working && creep.store[RESOURCE_ENERGY] === 0) {
      this.target = null;
      this.working = false;
      creep.say('🔄 harvest');
    }

    if (!this.working && creep.store.getFreeCapacity() === 0) {
      this.target = null;
      this.working = true;
      creep.say('🔧 repair');
    }

    if (this.working) {
      if (!this.target || this.target.hits === this.target.hitsMax) {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure =>
            this.validStructures.includes(structure.structureType) &&
            structure.hits < structure.hitsMax
        });
        if (targets.length > 0) {
          this.target = targets[0];
        }
      }
      if (this.target) {
        if (creep.repair(this.target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    } else {
      if (!this.target) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          this.target = sources[0];
        }
      }
      if (this.target) {
        if (creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  }
}