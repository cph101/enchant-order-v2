import Footer from "./components/Footer";
import Header from "./components/Header";
import "./scripts/jquery-3.7.1.min.js";
import EnchantSelect from "./components/EnchantSelect";
import * as translator from "./scripts/translation.js";
import LoadDetector from "./components/LoadDetector.jsx";

// <span data-trnskey="translation_key">Usage</span>

export default function App() {
  return (
    <main>
      <Header />
      <EnchantSelect />
      <Footer />
      <LoadDetector callback={function () {
        async function changeLanguage() {
          await translator.setupLanguage();
          // async wrapper neccessary in order to execute setupLang function
        }
        changeLanguage();

        window.setTimeout(() => {
          document.documentElement.classList.add("finishedLoading");
          const myEvent = new CustomEvent("test", {
            detail: {},
          });
          document.documentElement.dispatchEvent(myEvent);
        }, 500);
      }} />
    </main>
  );
}
