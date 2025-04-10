import BaseRole from "./Base";

const LD_HARVERSTER_STATES = {
  roomTransfer: {
    transition: (role) => {
      const { creep } = role;
      if (creep.store.getFreeCapacity() === 0 && creep.room.name === creep.memory.homeRoom) {
        return 'delivering';
      } else if (creep.store.getUsedCapacity() === 0  && creep.room.name === creep.memory.targetRoom) {
        return 'harvesting';
      }
      return null;
    },
    run: (role) => {
      const { creep } = role;
      // To-Do Refactor this
      // Maybe use 3 different properties for the rooms: 
      //  homeRoom, resoucesRoom, targetRoom
      //  Dont forget to use gettes to instanciate the rooms!!!!
      // The other aproach could be the use of a single property for the target room
      // an in the memory only store the resources room and the home room as strings
      // the name of the rooms could be used to identify the rooms
      if(creep.room.name === creep.memory.homeRoom && creep.store.getUsedCapacity() === 0) {
        const exit = role.targetRoom;
        if (exit) {
          creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else if (creep.room.name === creep.memory.targetRoom && creep.store.getFreeCapacity() === 0) {
        const exit = creep.room.findExitTo(role.homeRoom.name);
        const exitPos = creep.pos.findClosestByPath(exit);
        if (exitPos) {
          creep.moveTo(exitPos, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  },
  harvesting: {
    transition: (role) => {
      if (role.creep.store.getFreeCapacity() === 0) {
        return 'roomTransfer';
      }
      return null;
    },
    run: (role) => {
      if (!role.target) {
        const sources = role.creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          role.target = sources[0];
        }
      }
      if (role.creep.harvest(role.target) === ERR_NOT_IN_RANGE) {
        role.creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  },
  delivering: {
    transition: (role) => {
      const { creep } = role;
      if (creep.store.getUsedCapacity() === 0) {
        return 'roomTransfer';
      }
    },
    run: (role) => {
      const { creep } = role;
      if(!role.target || role.target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
          filter: structure =>
            [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
          role.target = targets[0];
        }
      }
      if(creep.transfer(role.target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(role.target, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
  
};


export default class LDHarvester extends BaseRole {
  
  states = LD_HARVERSTER_STATES;

  /**
   * Return the room where the creep is from.
   * The inicialization is done in the creep construction process.
   * @type {RoomPosition}
   * @throws {Error} If the target room is not set in memory or not found.
   */
  get homeRoom() {
    const { creep } = this;
    if (!creep.memory.homeRoom) {
      throw new Error('Home room not set in memory');
    }
    const room = Game.rooms[creep.memory.homeRoom];
    if (!room) {
      throw new Error(`Home room ${creep.memory.homeRoom} not found`);
    }
    return room;
  }

  /**
   * Return the room where the creep is going to harvest.
   * The inicialization is done in the creep construction process.
   * @type {RoomPosition} - The cordinates to the room exit to the target room.
   * @throws {Error} If the target room is not set in memory or not found.
   */
  get targetRoom() {
    const { creep } = this;
    if (!creep.memory.targetRoom) {
      throw new Error('Target room not set in memory');
    }
    const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
    const exitPos = creep.pos.findClosestByPath(
      exitDir
    );
    if (!exitPos) {
      throw new Error(`Exit to target room ${creep.memory.targetRoom} not found [creep.room: ${creep.room.name}]`);
    }
    return exitPos;
  }

  getInitialState() {
    return 'roomTransfer';
  }

  onEnterState(newState) {
    super.onEnterState(this, newState);
    const { creep } = this;
    creep.say(newState === 'harvesting' ? '⛏️ harvesting' : '🔄 transferring');
  }
}
