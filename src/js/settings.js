import { update as updateMetadata } from "../js/Data.js";
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
        refreshSettings();
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
    refreshSettings();
    saveSettings();
}
function refreshSettings() {
    refreshSelectedItem();
    refreshSelectedModpack();
    refreshSelectedTab();
    refreshTheme();
}

function refreshSelectedItem() {
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemRender"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshEnchantRender"));
}
function refreshSelectedModpack() {
    const modpack_name = Settings.getSelectedModpack();
    const modpack_filepath = "./json/" + modpack_name + ".json";
    fetch(modpack_filepath)
        .then((response) => response.json())
        .then(updateMetadata);
}
function refreshSelectedTab() {
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemRender"));
}
function refreshTheme() {}
