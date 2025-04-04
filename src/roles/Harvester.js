export default class Harvester {

    constructor(creep) {
        this.creep = creep;
    }

    run() {
        const { creep } = this;

        if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
            creep.say('📤 deliver');
        }

        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.harvesting = true;
            creep.say('⛏️ harvest');
        }

        if (creep.memory.harvesting) {
            const sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                const source = sources[0];
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (
                    (structure.structureType === STRUCTURE_SPAWN ||
                     structure.structureType === STRUCTURE_EXTENSION ||
                     structure.structureType === STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                )
            });

            if (targets.length > 0) {
                const target = targets[0];
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}
