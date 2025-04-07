import { Roles } from '../roles';

Creep.prototype.runRole = function () {
  const role = this.memory.role;
  const RoleClass = Roles[role];
  if (!RoleClass) {
    console.log(`[ERR] Role ${role} not found for creep ${this.name}`);
    return;
  }
  const roleInstance = new RoleClass(this);
  roleInstance.run();
}
