import BaseRole from './Base';

export default class Harvester extends BaseRole {
    run() {
        const { creep } = this;

        if (this.working && creep.store.getFreeCapacity() === 0) {
            this.working = false;
            this.target = null;
            creep.say('📤 deliver');
        }

        if (!this.working && creep.store[RESOURCE_ENERGY] === 0) {
            this.working = true;
            this.target = null;
            creep.say('⛏️ harvest');
        }

        if (this.working) {
            if (!this.target || this.target.energy == 0) {
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
        } else {
            if (!this.target || this.target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: structure =>
                        [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(structure.structureType) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });
                if (targets.length > 0) {
                    this.target = targets[0];
                }
            }
            if (this.target) {
                if (creep.transfer(this.target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(this.target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}
