let languageJson = {};
let languageId = '';
let langListenerAttached;

const languages = {
  'en': ['English', 2],
  'pt-BR': ['Português', 3],
  'ru-RU': ['Русский', 2],
  'zh-CN': ['中文', 3],
  'nl': ['Nederlands', 2],
  'de': ['Deutsch', 1],
};

// END CONFIG

export async function setupLanguage() {
  await defineBrowserLanguage();
  await changePageLanguage(languageId || 'en');
  attachLanguagePreferences()
}

export function attachLanguagePreferences() {
  if (langListenerAttached) return;
  const langSelect = document.querySelector('[data-property="languageSelect"]');

  for (const [languageCode, [languageName, _]] of Object.entries(languages)) {
    langSelect.innerHTML += `<option value="${languageCode}" ${languageId === languageCode ? "selected" : ""}>${languageName}</option>`;
  }

  langSelect.addEventListener('change', (e) => {
    changePageLanguage(e.target.value);
  });
  langListenerAttached = true;
}


export async function defineBrowserLanguage() {
  if (!localStorage.getItem("savedlanguage")) {
    const browserLanguage = navigator.language || navigator.userLanguage;
    languageId = languages[browserLanguage] ? browserLanguage : 'en';
  } else {
    languageId = localStorage.getItem("savedlanguage");
  }
}

export async function changePageLanguage(language) {
  if (!languages[language]) {
    console.error("Trying to switch to unknown language:", language);
    return;
  }

  languageId = language;
  try {
    languageJson = await loadJsonLanguage(language);
    if (languageJson) {
      changeLanguageByJson(languageJson);
      localStorage.setItem("savedlanguage", language);
    }
  } catch (error) {
    console.error('Language file error:', error);
  }
}

export function loadJsonLanguage(language) {
  const cacheKey = languages[language][1];
  return fetch(`languages/${language}.json?${cacheKey}`)
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

export function changeLanguageByJson(languageJson) {
  const map = {};
  for (const i in languageJson.enchants) {
    if (map[languageJson.enchants[i]]) {
      console.error("Duplicate string for enchant names (must be unique)", languageId, i, map[languageJson.enchants[i]]);
    }
    map[languageJson.enchants[i]] = i;
  }

  document.querySelectorAll('*[data-trnskey]').forEach(element => {
    element.innerHTML = languageJson[element.getAttribute("data-trnskey")] || '';
  });
}

export function searchForComponents() {
  console.log("translation script active");
  document.querySelectorAll('*[data-trnskey]').forEach(element => {
    element.innerHTML = languageJson[element.getAttribute("data-trnskey")] || '';
  });
}