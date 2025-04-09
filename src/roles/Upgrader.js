import BaseRole from "./Base";


const UPGRADER_STATES = {
  harvesting: {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'upgrading';
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
  upgrading: {
    transition: (role) => {
      if (role.creep.store[RESOURCE_ENERGY] === 0) {
        return 'harvesting';
      }
      return null;
    },
    run: (role) => {
      const controller = role.creep.room.controller;
      if (controller) {
        if (role.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
          role.creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};


export default class Upgrader extends BaseRole {
  states = UPGRADER_STATES;

  getInitialState() {
    return 'harvesting';
  }

  onEnterState(newState) {
    const { creep } = this;
    creep.say(newState === 'upgrading' ? '🔄 upgrading' : '⛏️ harvesting');
  }
}
