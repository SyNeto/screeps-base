import './prototypes';

export const loop = () => {
  // Clear memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  const spawn = Game.spawns['Spawn1'];
  const energyAvailable = spawn.room.energyAvailable;
  if (energyAvailable > 249) {
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const parts = [WORK, CARRY, MOVE, MOVE];
    if (harvesters.length < 2) {
      spawn.spawnCreep(parts, `Harvester${Game.time}`, { memory: { role: 'harvester' } });
    } else if (upgraders.length < 3) {
      spawn.spawnCreep(parts, `Upgrader${Game.time}`, { memory: { role: 'upgrader' } });
    } else if (builders.length < 1) {
      spawn.spawnCreep(parts, `Builder${Game.time}`, { memory: { role: 'builder' } });
    }
  }
  
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.runRole();
  }
};
