import { useState } from "react";
import { Settings } from "../js/settings.js";
import { Metadata } from "../js/Data.js";
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
        <div>
            <div className="grid grid-cols-7 grid-rows-4 gap-4 mx-auto h-[35%]">
                {modpack_is_loaded ? enchantent_namespaces.map(generateEnchantmentSelector) : <p>Loading...</p>}
            </div>
        </div>
    );
}

function generateEnchantmentSelector(enchantment_namespace) {
    const enchantment_name = Metadata.enchantmentNamespaceToName(enchantment_namespace);
    const key = Math.random();
    return (
        <div key={key} className="p-2 rounded-[10px] text-center bg-[--foreobject] flex flex-col enchant-selected">
            {generateSpacerOrNotFor(enchantment_namespace)}
            <span className="py-2">{enchantment_name}</span>
            <div className="grow" />
            {generateLevelSelectors(enchantment_namespace)}
        </div>
    );
}

function generateSpacerOrNotFor(enchantment_namespace, inverted = false) {
    const maxLevel = Metadata.enchantmentNamespaceToMaxLevel(enchantment_namespace);
    if (inverted ? maxLevel == 1 : maxLevel != 1) return "";

    return <div className="grow" />
}

function generateLevelSelectors(enchantment_namespace) {
    const maxLevel = Metadata.enchantmentNamespaceToMaxLevel(enchantment_namespace);
    if (maxLevel == 1) return "";
    const levels = [...Array(maxLevel).keys()];
    return (
        <div className="flex">
            {levels.map(index => generateLevelSelector(index + 1))}
        </div>
    );
}
function generateLevelSelector(level) {
    return (
        <div
            className={`rounded-[4px] text-center flex-auto p-[2px] mx-[0.7px]`}
            key={level}
            style={{ backgroundColor: `rgba(0, 0, 0, 0.14)` }}
        >
            <span style={{ opacity: "1" }}>
                {level}
            </span>
        </div>
    );
}
