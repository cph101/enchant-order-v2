export class Settings {
    constructor() {
        this.defaultSettings = {
            theme: 'light',
            fontSize: 'medium',
            selectedItem: 'Sword'
        };
        this.loadSettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('settings');
        this.settings = savedSettings ? JSON.parse(savedSettings) : { ...this.defaultSettings };
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    getSetting(key) {
        return this.settings[key];
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
    }
}

/*
const settings = new Settings();

// Retrieving a setting
const currentTheme = settings.getSetting('theme');
console.log('Current Theme:', currentTheme);

// Updating a setting
settings.updateSetting('fontSize', 'large');
console.log('Updated Font Size:', settings.getSetting('fontSize'));

// Resetting settings to defaults
settings.resetSettings();
console.log('Settings Reset:', settings.getSetting('fontSize')); // Should display 'medium'
*/