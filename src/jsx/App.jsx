import "../js/jquery-3.7.1.min.js";
import Header from "./Header.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";
import LoadDetector from "./LoadDetector.jsx";
import * as translator from "../js/translation.js";

// <span data-trnskey="translation_key">Usage</span>

export default function App() {
    return (
        <main>
            <Header />
            <Content />
            <Footer />
            <LoadDetector callback={onLoad} />
        </main>
    );
}

async function onLoad() {
    await translator.setupLanguage();
    document.documentElement.classList.add("finishedLoading");
    document.documentElement.dispatchEvent(new CustomEvent("RefreshModpackSelect"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemSelect"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshEnchantSelect"));
}
