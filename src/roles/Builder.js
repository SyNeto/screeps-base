import BaseRole from "./Base";

const BUILDER_STATES = {
  harvesting : {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'building';
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
  building: {
    transition: (role) => {
      if (role.creep.store[RESOURCE_ENERGY] === 0) {
        return 'harvesting';
      }
      return null;
    },
    run: (role) => {
      const targets = role.creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (role.creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
}

export default class Builder extends BaseRole {
  states = BUILDER_STATES;

  getInitialState() {
    return 'harvesting';
  }

  onEnterState(newState) {
    const { creep } = this;
    creep.say(newState === 'building' ? '🔨 building' : '⛏️ harvesting');
  }
}
