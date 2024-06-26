import { update as updateMetadata, Metadata } from "./Data";

export class Settings {
    static defaultSettings = {
        selectedItem: "sword",
        selectedModpack: "Minecraft",
        selectedTab: "combat",
        theme: "dark"
    };
    static settings = {};

    static loadSettings() {
        const savedSettings = localStorage.getItem("settings");
        Settings.settings = savedSettings ? JSON.parse(savedSettings) : { ...Settings.defaultSettings };
        refreshAll();
        resetSettings();
    }

    static getSelectedItem() {
        return Settings.getSetting("selectedItem");
    }
    static getSelectedModpack() {
        return Settings.getSetting("selectedModpack");
    }
    static getSelectedTab() {
        return Settings.getSetting("selectedTab");
    }
    static getTheme() {
        return Settings.getSetting("theme");
    }
    static getSetting(key) {
        return Settings.settings[key];
    }

    static setSelectedItem(item_name) {
        Settings.setSetting("selectedItem", item_name);
        refreshSelectedItem();
    }
    static setSelectedModpack(modpack_name) {
        Settings.setSetting("selectedModpack", modpack_name);
        refreshSelectedModpack();
    }
    static setSelectedTab(tab_name) {
        Settings.setSetting("selectedTab", tab_name);
        refreshSelectedTab();
    }
    static setTheme(theme) {
        Settings.setSetting("theme", theme);
    }
    static setSetting(key, value) {
        Settings.settings[key] = value;
        saveSettings();
    }
}

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(Settings.settings));
}
function resetSettings() {
    Settings.settings = Settings.defaultSettings;
    refreshAll();
    saveSettings();
}
function refreshAll() {
    refreshSelectedModpack();
    refreshSelectedItem();
    refreshSelectedTab();
    refreshTheme();
}

function refreshSelectedItem() {
    $('html').trigger("RefreshItemSelect", []);
    $('html').trigger("RefreshEnchantSelect", []);
}
async function refreshSelectedModpack() {
    const modpack_name = Settings.getSelectedModpack();
    const modpack_filepath = "./modpacks/" + modpack_name + ".json";
    await fetch(modpack_filepath)
        .then((response) => response.json())
        .then(updateMetadata);

    refreshItemAfterModpack(Settings.getSelectedItem());
    $('html').trigger("RefreshModpackSelect", []);
    refreshSelectedItem();
}
function refreshSelectedTab() {
    $('html').trigger("RefreshItemSelect", []);
}
function refreshTheme() {}

function refreshItemAfterModpack(previous_item_namespace) {
    const item_namespaces = Metadata.getItemNamespaces();
    const new_modpack_has_item = !item_namespaces.includes(previous_item_namespace);
    if (new_modpack_has_item) {
        const new_item_namespace = Metadata.getFirstItemNamespaceInLayout();
        Settings.setSelectedItem(new_item_namespace);
    }
}
