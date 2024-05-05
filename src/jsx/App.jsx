import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import "../js/jquery-3.7.1.min.js";
import EnchantSelect from "./EnchantSelect.jsx";
import * as translator from "../js/translation.js";
import LoadDetector from "./LoadDetector.jsx";

// <span data-trnskey="translation_key">Usage</span>

export default function App() {
    return (
        <main>
            <Header />
            <EnchantSelect />
            <Footer />
            <LoadDetector
                callback={function() {
                    async function changeLanguage() {
                        await translator.setupLanguage();
                        // async wrapper neccessary in order to execute setupLang function
                    }
                    changeLanguage();
                    window.setTimeout(onLoad, 500);
                }}
            />
        </main>
    );
}

function onLoad() {
    document.documentElement.classList.add("finishedLoading");
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemRender"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshEnchantRender"));
}

