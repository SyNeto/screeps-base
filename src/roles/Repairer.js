import BaseRole from "./Base";

const REPAIRER_STATES = {
  harvesting: {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'repairing';
      }
      return null;
    },
    run: (role) => {
      const sources = role.creep.room.find(FIND_SOURCES);
      if (sources.length > 0) {
        const source = sources[1]; // To-Do: Refactor this to use the closest source
        if (role.creep.harvest(source) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  },
  repairing: {
    transition: (role) => {
      if (role.creep.store[RESOURCE_ENERGY] === 0) {
        return 'harvesting';
      }
      return null;
    },
    run: (role) => {
      const targets = role.creep.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax && 
          [STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_WALL].includes(structure.structureType)
      });
      if (targets.length > 0) {
        if (role.creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

export default class Repairer extends BaseRole {
  states = REPAIRER_STATES;

  getInitialState() {
    return 'repairing';
  }

  onEnterState(newState) {
    const { creep } = this;
    creep.say(newState === 'repairing' ? '🔧 repairing' : '⛏️ harvesting');
  }
}