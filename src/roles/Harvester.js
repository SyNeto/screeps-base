import BaseRole from "./Base";

/**
 * To-Do:
 * Refactor this class, this class suffers from issues that came
 * from the refactoring stage of the BaseRole class (while making test).
 * 
 * * Move the states to a separate module
 * * refactor transition states to functions to reuse them (or use a class)
 * * Refactor Base class to manage room coordinates as valid targets
 * * Reimplment the Long Range Harvester to use the target mechanism
 *   to manage rooms transfers
 */


const HARVESTER_STATES = {
  harvesting: {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'delivering';
      }
      return null;
    },
    run: (role) => {
      if (!role.target || role.target.energy === 0) {
        const sources = role.creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          role.target = sources[1];
        }
      }
      if (role.target) {
        const isSource = role.target instanceof Source;
        if (role.creep.harvest(role.target) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffaa00' } });
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
      if (!role.target) {
        const targets = role.creep.room.find(FIND_MY_STRUCTURES, {
          filter: structure =>
            [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
          role.target = targets[0];
        }
      }
      if (role.target && role.target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (role.creep.transfer(role.target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        role.creep.say('😕')
        const targets = role.creep.room.find(FIND_MY_STRUCTURES, {
          filter: structure =>
            [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        role.creep.moveTo(Game.spawns.Spawn1);
        if (targets.length > 0) {
          role.target = targets[0];
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
    super.onEnterState(this, newState);
    creep.say(newState === 'delivering' ? '📤 delivering' : '⛏️ harvesting');
  }
}