import { Settings } from "../js/settings.js";
import { update as updateMetadata } from "../js/Data.js";

Settings.loadSettings();
const modpack_namespace = Settings.getSelectedModpack();
const modpack_filepath = "./json/" + modpack_namespace + ".json";

fetch(modpack_filepath)
    .then((response) => response.json())
    .then(updateMetadata); // set enchantments for Minecraft or modpack
