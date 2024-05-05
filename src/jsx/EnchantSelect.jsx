import { useState } from "react";
import { Settings } from "../js/settings.js";
import { Metadata } from "../js/Data.js";
import LoadDetector from "./LoadDetector.jsx";
import * as translator from "../js/translation.js";
import { isWhiteSpaceSingleLine } from "typescript";

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function EnchantSelect() {
    const forceUpdate = useForceUpdate();
    document.documentElement.addEventListener("RefreshEnchantSelect", forceUpdate);

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
        <div key={key} className="p-2 rounded-[10px] text-center bg-[--foreobject]">
            <span data-trnskey={"enchants." + enchantment_namespace}>Loading...</span>
            <br />
            {generateLevelSelectors(enchantment_namespace)}
            <LoadDetector callback={translator.searchForComponents} />
        </div>
    );
}

function generateLevelSelectors(enchantment_namespace) {
    const maxLevel = Metadata.enchantmentNamespaceToMaxLevel(enchantment_namespace);
    const isSingleLevel = maxLevel == 1;
    const levels = [...Array(maxLevel).keys()];
    return (
        <div className="flex">
            {levels.map(level => generateLevelSelector(level, isSingleLevel))}
        </div>
    );
}
function generateLevelSelector(level, isSingleLevel) {
    return (
        <div
            className={`rounded-[4px] text-center flex-auto p-[2px] mx-[0.7px]`}
            key={level + 1}
            style={{ backgroundColor: `rgba(0, 0, 0, ${isSingleLevel ? 0.09 : 0.14})` }}
        >
            <span style={{ opacity: isSingleLevel ? "0.5" : "1" }}>
                {isSingleLevel ? "Single Level" : level + 1}
            </span>
        </div>
    );
}
