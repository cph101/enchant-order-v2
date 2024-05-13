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
    $('html').addClass("finishedLoading");
    $('html').trigger("RefreshModpackSelect", []);
    $('html').trigger("RefreshItemSelect", []);
    $('html').trigger("RefreshEnchantSelect", []);
    $('html').trigger("RefreshItemDisplay", []);
}
