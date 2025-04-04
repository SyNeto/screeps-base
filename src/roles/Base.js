export default class BaseRole {
  constructor(creep) {
    if(new.target === BaseRole) {
      throw new Error("Cannot instantiate BaseRole directly, you must immplement it in a subclass.");
    }
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
}