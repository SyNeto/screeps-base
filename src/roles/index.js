import Harvester from "./Harvester";
import LDHarvester from "./LDHarvester";
import Builder from "./Builder";
import Upgrader from "./Upgrader";
import Repairer from "./Repairer";

export const Roles = {
  harvester: Harvester,
  LDHarvester: LDHarvester,
  builder: Builder,
  upgrader: Upgrader,
  repairer: Repairer,
}