import './prototypes';

export const loop = () => {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creep.runRole();
  }
};
