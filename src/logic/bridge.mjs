import { Settings } from "../scripts/settings.js"
//import { Slide, toast } from 'react-toastify';

//import 'react-toastify/dist/ReactToastify.css';

export let TRACKED_DATA = {
    itemToEnchants: {},
    itemsToIds: {},
    idsToEnchants: {}
};

export let OUTPUT_DATA = {
    enchantNames: [],
    enchantsHaveLoaded: false
};

export function getEnchants() {
    /*console.log("test:", TRACKED_DATA.itemsToIds);
    console.log("itemsToEnchants: ", TRACKED_DATA.itemToEnchants);
    console.log("itemsToEnchants: ", TRACKED_DATA.idsToEnchants);*/
    let amog = [];
    try {
        TRACKED_DATA.itemToEnchants[TRACKED_DATA.itemsToIds[
            new Settings().getSetting("selectedItem").toLowerCase().replaceAll(" ", "_")
        ]].map((enchantId) => {
            amog.push(TRACKED_DATA.idsToEnchants[enchantId]);
        });
        OUTPUT_DATA.enchantNames = amog;
        OUTPUT_DATA.enchantsHaveLoaded = true;
        const refreshEnchantComponent = new CustomEvent("refreshEnchantRender", {
            detail: {},
        });
        document.documentElement.dispatchEvent(refreshEnchantComponent);
    } catch (e) {
        /*toast.error('Failed loading enchants for item ' + new Settings().getSetting("selectedItem"), {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Slide,
            closeButton: false
            });*/
    }
}

export function getStoredEnchants() {
    return (OUTPUT_DATA.enchantNames);
}