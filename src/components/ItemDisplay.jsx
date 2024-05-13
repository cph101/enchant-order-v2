import React, { useState } from "react";
import { Metadata } from "../scripts/Data";

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ItemDisplay() {
    const forceUpdate = useForceUpdate();
    $('html').on("RefreshItemDisplay", forceUpdate);

    const item_namespaces = ["sword", "book"];
    const modpack_is_loaded = Metadata.modpackIsLoaded;
    return (
        <div id="itemDisplay">
            {generateItemDisplays(modpack_is_loaded, item_namespaces)}
        </div>
    );
}

function generateItemDisplays(modpack_is_loaded, item_namespaces) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-1 grid-rows-8 md:grid-rows-8 gap-3 mx-auto h-[35%]">
                {modpack_is_loaded ? item_namespaces.map(generateItemDisplay) : <p>Loading...</p>}
            </div>
        </div>
    );
}

function generateItemDisplay(item_namespace) {
    const enchantment_namespaces = Metadata.itemToEnchantmentNames(item_namespace);
    const item_name = Metadata.itemNamespaceToName(item_namespace);
    const item_icon = generateItemIcon(item_namespace);
    const on_click = () => {
        console.log(item_namespace + " clicked");
        // TODO: when a displayed item is clicked, the next clicked enchantments will be added to the clicked item
    };
    return (
        <a onClick={on_click} key={item_namespace}>
            <div>
                {item_icon}
                {item_name}
            </div>
            <ul>
                {enchantment_namespaces.map(generateEnchantmentDisplay)}
            </ul>
        </a>
    );
}

function generateItemIcon(item_namespace) {
    const icon_filepath = "/enchant-order-v2/images/" + item_namespace + ".gif";
    const item_icon = <img src={icon_filepath} className="itemDisplayImage" />;
    return item_icon;
}

function generateEnchantmentDisplay(enchantment_namespace) {
    const enchantment_name = Metadata.enchantmentNamespaceToName(enchantment_namespace);
    const key = Math.random();
    const on_click = () => {
        console.log(enchantment_namespace + " removed");
        document.getElementById(key).remove();
    };
    return (
        <li onClick={on_click} key={enchantment_namespace} id={key}>
            {enchantment_name}
        </li>
    );
}
