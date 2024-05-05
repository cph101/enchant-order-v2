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
        Settings.resetSettings();
    }

    static saveSettings() {
        localStorage.setItem("settings", JSON.stringify(Settings.settings));
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
    static getSetting(key) {
        return Settings.settings[key];
    }

    static setSelectedItem(item_name) {
        Settings.setSetting("selectedItem", item_name);
        document.documentElement.dispatchEvent(new CustomEvent("RefreshItemRender"));
        document.documentElement.dispatchEvent(new CustomEvent("RefreshEnchantRender"));
    }
    static setSelectedModpack(modpack_name) {
        Settings.setSetting("selectedModpack", modpack_name);
    }
    static setSelectedTab(tab_name) {
        Settings.setSetting("selectedTab", tab_name);
        document.documentElement.dispatchEvent(new CustomEvent("RefreshItemRender"));
    }
    static setSetting(key, value) {
        Settings.settings[key] = value;
        Settings.saveSettings();
    }

    static resetSettings() {
        Settings.settings = Settings.defaultSettings;
        Settings.saveSettings();
    }
}
