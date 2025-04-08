import BaseRole from './Base';

export default class Harvester extends BaseRole {

  resourceType = RESOURCE_ENERGY;
  validStructures = [
    STRUCTURE_SPAWN,
    STRUCTURE_EXTENSION,
    STRUCTURE_TOWER
  ];

  run() {
    const { creep } = this;

    if (this.working && creep.store.getFreeCapacity() === 0) {
      this.target = null;
      this.working = false;
      creep.say('📤 deliver');
    }

    if (!this.working && creep.store[RESOURCE_ENERGY] === 0) {
      this.target = null;
      this.working = true;
      creep.say('⛏️ harvest');
    }

    if (this.working) {
      const hasTarget = !!this.target;
      if (hasTarget) {
        if (creep.harvest(this.target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        const resources = creep.room.find(FIND_SOURCES)
        if (resources.length > 0) {
          this.target = resources[Math.floor(Math.random() * resources.length)];
        }
      }
    } else {
      const hasTarget = !!this.target;
      const targetFreeCapacity = this.target ? this.target.store.getFreeCapacity(RESOURCE_ENERGY) : 0;
      if (hasTarget) {
        if (targetFreeCapacity > 0) {
          if (creep.transfer(this.target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffffff' } });
          }
        } else {
          this.target = null;
        }
      } else {
        console.log('No target');
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
          filter: structure =>
            [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
          this.target = targets[Math.floor(Math.random() * targets.length)];
        } else {
          creep.say('No target');
        }
      }
    }
  }
}
