import './prototypes';

export const loop = () => {
  // Clear memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  const creeps = _(Game.creeps)
    .groupBy('memory.role')
    .mapValues((creeps) => creeps.length)
    .value();
  const PARTS = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
  const cost = 500;
  const spawn = Game.spawns['Spawn1'];
  const energyAvailable = spawn.room.energyAvailable;

  if (energyAvailable >= cost && (creeps.harvester < 2 || creeps.harvester === undefined)) {
    spawn.spawnCreep(PARTS, `Harvester${Game.time}`, {
      memory: { role: 'harvester' },
    });
  } else if (energyAvailable >= cost && (creeps.LDHarvester < 0 || creeps.LDHarvester === undefined)) {
    spawn.spawnCreep(PARTS, `LDHarvester${Game.time}`, {
      memory: {
        role: 'LDHarvester',
        homeRoom: 'W7N21',
        targetRoom: 'W6N21',
      },
    });
  } else if (energyAvailable >= cost && (creeps.builder < 5 || creeps.builder === undefined)) {
    spawn.spawnCreep(PARTS, `Builder${Game.time}`, {
      memory: { role: 'builder' },
    });
  } else if (energyAvailable >= cost && (creeps.upgrader < 0 || creeps.upgrader === undefined)) {
    spawn.spawnCreep(PARTS, `Upgrader${Game.time}`, {
      memory: { role: 'upgrader' },
    });
  } else if (energyAvailable >= cost && (creeps.repairer < 2 || creeps.repairer === undefined)) {
    spawn.spawnCreep(PARTS, `Repairer${Game.time}`, {
      memory: { role: 'repairer' },
    });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.runRole();
  }

};
