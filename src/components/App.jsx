import Footer from "./Footer";
import Content from "./Content";
import Header from "./Header";
import { Translator } from "../scripts/Translator";
import LoadDetector from "./LoadDetector";
import { Slide, ToastContainer } from "react-toastify";

export default function App() {
    return (
        <main>
            <Header />
            <Content />
            <Footer />
            <LoadDetector callback={onLoad} />
            <ToastContainer 
                pauseOnHover={false}
                closeOnClick={false}
                draggable={false}
                closeButton={false}
                transition={Slide}
                position="bottom-right"
                theme="colored"
            />
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
