import React, { useEffect, useState } from "react";
import { Settings } from "../scripts/settings.js";
import { Metadata } from "../logic/js/Data.js";
import LoadDetector from "./LoadDetector";
import * as translator from "../scripts/translation.js";

// {getStoredEnchants().map((name) => {return(  )})}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function EnchantSelect() {
    const forceUpdate = useForceUpdate();

    document.documentElement.addEventListener("refreshEnchantRender", event => {
        forceUpdate();
    });

    const item_namespace = new Settings().getSetting("selectedItem").toLowerCase().replaceAll(" ", "_");
    const enchantent_namespaces = Metadata.itemToEnchantmentName(item_namespace);
    const modpack_is_loaded = Metadata.modpackIsLoaded;
    return (
        <div className="h-screen px-7">
            <div className="grid grid-cols-8 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-3 mx-auto h-[35%]">
                {modpack_is_loaded ? enchantent_namespaces.map(generateEnchantmentSelection) : <p>Loading...</p>}
            </div>
        </div>
    );
}

function generateEnchantmentSelection(enchantment_namespace) {
    const loading_display = <span data-trnskey={"enchants." + enchantment_namespace}>
        Loading...
    </span>;
    const key = Math.random();
    return (
        <div key={key} className="enchcard text-center">
            {loading_display}
            <LoadDetector callback={translator.searchForComponents} />
        </div>
    );
}
