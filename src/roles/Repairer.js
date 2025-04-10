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
      if (!role.target || role.target.energy === 0) {
        const sources = role.creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          role.target = sources[1];
        }
        return;
      }
      if (role.creep.harvest(role.target) === ERR_NOT_IN_RANGE) {
        role.creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffaa00' } });
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
      if (!role.target || role.target.hits === role.target.hitsMax) {
        const targets = role.creep.room.find(FIND_STRUCTURES, {
          filter: structure => structure.hits < structure.hitsMax &&
            [STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_WALL].includes(structure.structureType)
        });
        if (!!targets && targets.length > 0) {
          role.target = targets[Math.floor(Math.random() * targets.length)];
        } else {
          console.log(`[WARNING] No repair targets found for ${role.creep.name}`);
        }
        return;
      }
      if (role.creep.repair(role.target) === ERR_NOT_IN_RANGE) {
        role.creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffffff' } });
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
    super.onEnterState(this, newState);
    creep.say(newState === 'repairing' ? '🔧 repairing' : '⛏️ harvesting');
  }
}