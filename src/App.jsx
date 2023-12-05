import Footer from './components/Footer.jsx';
import Settings from './components/Settings.jsx';
import './scripts/jquery-3.7.1.min.js';
import { useEffect } from 'react';
import * as translator from './scripts/translation.js';

// <span data-trnskey="translation_key">Usage</span>

export default function App() {
  useEffect(() => {
    async function changeLanguage() {
      await translator.setupLanguage();
      // async wrapper neccessary in order to execute setupLang function
    }
    changeLanguage();
  }, []);

  return (
    <main>
      <Settings />
      <Footer />
    </main>
  );
}
