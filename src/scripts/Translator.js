export const languages = {
  'en': 'English',
  'pt-BR': 'Português',
  'ru-RU': 'Русский',
  'zh-CN': '中文',
  'nl': 'Nederlands',
  'de': 'Deutsch',
  'be_BY': 'Belarusian',
};

export class Translator {

  static languageJson = {};
  static languageId = '';
  static langListenerAttached;

  static async setupLanguage() {
    await this.#defineBrowserLanguage();
    await this.changePageLanguage(this.languageId || 'en');
  }

  static async #defineBrowserLanguage() {
    if (!localStorage.getItem("savedlanguage")) {
      const browserLanguage = navigator.language || navigator.userLanguage;
      this.languageId = languages[browserLanguage] ? browserLanguage : 'en';
    } else {
      this.languageId = localStorage.getItem("savedlanguage");
    }
  }

  static async changePageLanguage(language) {
    if (!languages[language]) {
      console.error("Trying to switch to unknown language:", language);
      return;
    }

    this.languageId = language;
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

  static #changeLanguageByJson(languageJson) {
    const map = {};
    for (const i in languageJson.enchants) {
      if (map[languageJson.enchants[i]]) {
        console.error("Duplicate string for enchant names (must be unique)", this.languageId, i, map[languageJson.enchants[i]]);
      }
      map[languageJson.enchants[i]] = i;
    }

    document.querySelectorAll('*[data-trnskey]').forEach(element => {
      element.innerHTML = languageJson[element.getAttribute("data-trnskey")] || '';
    });
  }

  static searchForComponents() {
    document.querySelectorAll('*[data-trnskey]').forEach(element => {
      var paths = element.getAttribute("data-trnskey").split(".");
      var object = this.languageJson[paths[0]];
      for (var i = 1; i < paths.length; i++) {
        object = object[paths[i]];
      }
      element.innerHTML = object
    });
  }

  static getTranslationUnsafe(key, fallback = key) {
    if (key == null) return fallback; // prevent prerender errors
    var paths = key.split(".");
    var object = this.languageJson[paths[0]];
    for (var i = 1; i < paths.length; i++) {
      if (object == null) return fallback; // prevent prerender errors #2
      object = object[paths[i]];
    }
    return object;
  }
}
