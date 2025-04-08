export default class BaseRole {
  constructor(creep) {
    this.creep = creep;
  }

  get working() {
    const { creep } = this;
    return creep.memory.working;
  }

  set working(value) {
    const { creep } = this;
    creep.memory.working = value;
  }

  get target() {
    const { creep } = this;
    const targetId = creep.memory.targetId;

    if (!targetId) return null; // Love this line <3 <3 <3

    return Game.getObjectById(targetId);

  }

  set target(targetObject) {
    const { creep } = this;
    if (targetObject && targetObject.id) {
      creep.memory.targetId = targetObject.id;
    } else {
      delete creep.memory.targetId;
    }
  }
  
  run() {
    throw new Error("Method 'run' must be implemented in subclass");
  }
}