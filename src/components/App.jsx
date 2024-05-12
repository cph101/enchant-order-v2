import Footer from "./Footer";
import Content from "./Content";
import Header from "./Header";
import { Translator } from "../scripts/Translator";
import LoadDetector from "./LoadDetector";
import { ToastContainer } from "react-toastify";

export default function App() {
    return (
        <main>
            <Header />
            <Content />
            <Footer />
            <LoadDetector callback={onLoad} />
            <ToastContainer />
        </main>
    );
}

async function onLoad() {
    await Translator.setupLanguage();
    document.documentElement.classList.add("finishedLoading");
    document.documentElement.dispatchEvent(new CustomEvent("RefreshModpackSelect"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemSelect"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshEnchantSelect"));
    document.documentElement.dispatchEvent(new CustomEvent("RefreshItemDisplay"));
}
