import './prototypes';

export const loop = () => {
  // Clear memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
  
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.runRole();
  }
};
