export const languages = {
  'en': 'English',
  'pt-BR': 'Português',
  'ru-RU': 'Русский',
  'zh-CN': '中文',
  'nl': 'Nederlands',
  'de': 'Deutsch',
  'be_BY': 'Беларуская',
};

export class Translator {

  static languageJson = {};
  static languageId = '';
  static langListenerAttached;

  /**
   * @method Sets the page language to the most reasonable option
   * @protected Should only be called when the page fully loads
   */
  static async setupLanguage() {
    await this.#defineBrowserLanguage();
    await this.changePageLanguage(this.languageId || 'en');
  }

  /**
   * @method Loads the language stored in localstorage, 
   * or the default browser language if the former is not found.
   * @private Can and should only be used internally
   */
  static async #defineBrowserLanguage() {
    if (!localStorage.getItem("savedlanguage")) {
      const browserLanguage = navigator.language || navigator.userLanguage;
      this.languageId = languages[browserLanguage] ? browserLanguage : 'en';
    } else {
      this.languageId = localStorage.getItem("savedlanguage");
    }
  }

  static getActiveLanguageId() {
    return this.languageId;
  }

  static getAvailableLanguages() {
    return Object.entries(languages);
  }

  /**
   * @method loads a language by id and caches the result
   * @param {String} language The id of the language to load
   */
  static async changePageLanguage(language) {
    if (!languages[language]) {
      console.error("Trying to switch to unknown language:", language);
      return;
    }

    this.languageId = language;
    $('#settings-lang-select').get(0).value = language;
    try {
      this.languageJson = await this.#loadJsonLanguage(language);
      if (this.languageJson) {
        this.#changeLanguageByJson(this.languageJson);
        localStorage.setItem("savedlanguage", language);
      }
    } catch (error) {
      console.error('Language file error:', error);
    }
  }

  /**
   * @method fetches the lang file by id and sets the cached language to it
   * @param {String} language The language id
   * @private Can and should only be used internally
   * @alternative use {@link changePageLanguage} instead
   */
  static async #loadJsonLanguage(language) {
    return fetch(`languages/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Can\'t load language file');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Language file error:', error);
        return null;
      });
  }

  /**
   * @method sets the cached language file to the object passed
   * @param {Object} languageJson The raw language file
   * @private Can and should only be used internally
   * @alternative use {@link changePageLanguage} instead
   */
  static #changeLanguageByJson(languageJson) {
    const map = {};
    for (const i in languageJson.enchants) {
      if (map[languageJson.enchants[i]]) {
        console.error("Duplicate string for enchant names (must be unique)", this.languageId, i, map[languageJson.enchants[i]]);
      }
      map[languageJson.enchants[i]] = i;
    }

    this.#autoDetectTranstables()
  }

  /**
   * @method Detects elements with the data-trnskey attribute and auto-translates them
   * @private Can and should only be used internally
   * @called on rerender
   */
  static #autoDetectTranstables() {
    $('*[data-trnskey]').each((_, element) => {
      var paths = $(element).attr("data-trnskey").split(".");
      var object = this.languageJson[paths[0]];
      for (var i = 1; i < paths.length; i++) {
        object = object[paths[i]];
      }
      $(element).html(object);
    });
  }

  /**
   * @method Gets the raw translation of a translation key
   * @usage Only use within dynamic contexts where data-trnskey will not work, such as when placeholders are required.
   * @param {String} key The translation's key
   * @param {String} fallback The fallback for the translation as a string, not required.
   * @returns The translated result, as a {@link String}
   */
  static get(key, fallback = "Missing translation") {
    if (key == null) return fallback; // prevent prerender errors
    var paths = key.split(".");
    var object = this.languageJson[paths[0]];
    for (var i = 1; i < paths.length; i++) {
      if (object == null) return fallback; // prevent prerender errors #2
      object = object[paths[i]];
    }
    return object;
  }

  /**
   * @method Gets the raw translation of a translation key, and applies passed placeholders
   * @param {String} key The translation's key
   * @param {String[]} args An array of placeholders, replacing {0}, {1}, etc.
   * @prefer {@link getWPlaceholdersWFallback}, for doing the same while passing a failsafe.
   * @returns The translated result, as a {@link String}
   */
  static getWPlaceholders(key, ...args) {
    const translated = this.get(key, "");
    return translated.replace(/{([0-9]+)}/g, function (match, index) {
      return typeof args[index] === 'undefined' ? match : args[index];
    });
  }

  /**
   * @method Same as {@link getWPlaceholders}, but with a fallback
   * @param {String} key The translation's key
   * @param {String} fallback what to return if the translation is not found
   * @param {String[]} args An array of placeholders, replacing {0}, {1}, etc.
   * @returns The translated result, as a {@link String}
   */
  static getWPlaceholdersWFallback(key, fallback, ...args) {
    const translated = this.get(key, fallback);
    return translated.replace(/{([0-9]+)}/g, function (match, index) {
      return typeof args[index] === 'undefined' ? match : args[index];
    });
  }
}
