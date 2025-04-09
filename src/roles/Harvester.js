import BaseRole from "./Base";


const HARVESTER_STATES = {
  harvesting: {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'delivering';
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
  delivering: {
    transition: (role) => {
      if (role.creep.store[RESOURCE_ENERGY] === 0) {
        return 'harvesting';
      }
      return null;
    },
    run: (role) => {
      const targets = role.creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure =>
          [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 
      });
      if (targets.length > 0) {
        if (role.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};


export default class Harvester extends BaseRole {

  states = HARVESTER_STATES;
  
  getInitialState() {
    return 'harvesting';
  }

  onEnterState(newState) {
    const { creep } = this;
    creep.say(newState === 'delivering' ?  '📤 delivering' : '⛏️ harvesting');
  }
}