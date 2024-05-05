import { React, useState } from "react";
import { Settings } from "../js/settings.js";
import { Metadata } from "../js/Data.js";
import LoadDetector from "./LoadDetector.jsx";
import * as translator from "../js/translation.js";

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function EnchantSelect() {
    const forceUpdate = useForceUpdate();
    document.documentElement.addEventListener("RefreshEnchantRender", forceUpdate);

    const item_namespace = Settings.getSelectedItem();
    const enchantent_namespaces = Metadata.itemToEnchantmentNames(item_namespace);
    const modpack_is_loaded = Metadata.modpackIsLoaded;
    return generateEnchantmentSelectors(modpack_is_loaded, enchantent_namespaces);
}

function generateEnchantmentSelectors(modpack_is_loaded, enchantent_namespaces) {
    return (
        <div className="h-screen px-7">
            <div className="grid grid-cols-8 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-3 mx-auto h-[35%]">
                {modpack_is_loaded ? enchantent_namespaces.map(generateEnchantmentSelector) : <p>Loading...</p>}
            </div>
        </div>
    );
}

function generateEnchantmentSelector(enchantment_namespace) {
    const key = Math.random();
    return (
        <div key={key} className="enchcard text-center">
            <span data-trnskey={"enchants." + enchantment_namespace}>Loading...</span>
            <LoadDetector callback={translator.searchForComponents} />
        </div>
    );
}
