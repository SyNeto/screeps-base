/**
 * BaseRole class.
 * 
 * Abastract class that provides the base functionality for all roles.
 * 
 * Class resposabilities:
 * - Stores the creep reference to the creep executing the role.
 * - Manages the current state and configuration of the role.
 * - Provides methods to make transitions between states.
 * 
 */
export default class BaseRole {
  /**
   * States configuration object.
   * Must be defined in the subclass.
   * 
   * Example:
   * states = {
   *   state1: {
   *     transition: (roleInstance) => ...,
   *     run: (roleInstance) => ...
   *   },
   *   // Other states
   * }
   * 
   * @type {object}
   */
  states = {};

  /**
   * BaseRole constructor.
   * @param {Creep} creep - The creep instance executing the role.
   */
  constructor(creep){
    this.creep = creep;
  }

  /**
   * Get the creep current state from memory.
   * @type {string|null}
   * */
  get currentState() {
    return this.creep.memory.currentState;
  }

  /**
   * Set the creep current state to memory.
   * @param {string} state - The new state to set.
   * @type {void}
   */
  set currentState(state) {
    this.creep.memory.currentState = state;
  }

  /**
   * Get the creep target state from memory.
   * @type The target object or null if not set or if it's invalid.
   */
  get target() {
    const targetId = this.creep.memory.targetId;
    if (!targetId) return null;
    return Game.getObjectById(targetId);
  }

  /**
   * Get the creep target state from memory. 
   * @type {void}
   */
  set target(targetObject) {
    if (targetObject && targetObject.id) {
      this.creep.memory.targetId = targetObject.id;
    } else {
      delete this.creep.memory.targetId;
    }
  }

  /**
   * Get the initial state of the role.
   * 
   * Must be implemented in the subclass.
   * 
   * @abstract
   * @throws {Error} If the method is not implemented in the subclass.
   * @returns {string} The initial state of the role.
   */
  getInitialState() {
    throw new Error("Method 'getInialState' must be implemented in subclass.");
  }

  /**
   * Change the current state of the role to a new state.
   * 
   * @param {string} newState - The new state to change to.
   * @throws {Error} If the new state is not defined in the states configuration.
   * @returns {void}
   */
  changeState(newState) {
    if(!this.states[newState]) {
      throw new Error(`State ${newState} is not defined.`);
    }
    this.currentState = newState;
    this.onEnterState(newState);
  }

  /**
   * Hook method called when entering a new state.
   * 
   * Can be overridden in the subclass to perform custom actions.
   * 
   * @param {string} newState - The new state to transition to.  
   * @returns {void}
   */
  onEnterState(newState) {
    this.target = null;
  }

  /**
   * This method is called every tick.
   * 
   * It runs the current state's transition and run methods.
   * 
   * @trows {Error} If the current state is not defined in the states configuration.
   * @returns {void}
   */
  run() {
    if(!this.currentState) {
      this.currentState = this.getInitialState();  
    }

    let stateConfig = this.states[this.currentState];
    if(!stateConfig) {
      throw new Error(`No state config found for ${this.currentState}`);
    }

    if(stateConfig.transition && typeof stateConfig.transition === 'function') {
      const newState = stateConfig.transition(this);
      if(newState && newState !== this.currentState) {
        this.changeState(newState);
        stateConfig = this.states[newState];
      }
    }

    if(stateConfig.run && typeof stateConfig.run === 'function') {
      stateConfig.run(this);
    } else {
      throw new Error(`No run method found for ${this.currentState}`);
    }
  }
}
