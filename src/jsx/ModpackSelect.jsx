import { useState } from "react";
import { Settings } from "../js/settings.js";
import { Metadata } from "../js/Data.js";

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ModpackSelect() {
    const forceUpdate = useForceUpdate();
    document.documentElement.addEventListener("RefreshModpackSelect", forceUpdate);

    const modpack_is_loaded = Metadata.modpackIsLoaded;
    const modpack_namespaces = ["Minecraft", "Minecraft copy"];
    return (
        <div id="modpackSelect" className="dropdown">
            {modpack_is_loaded ? generateModpackSelectors(modpack_namespaces) : ""}
        </div>
    );
}

function generateModpackSelectors(modpack_namespaces) {
    const modpack_bullets = modpack_namespaces.map(generateModpackSelector);
    return (
        <div id="modpackSelect" className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1 bg-foreobject">
                {modpack_namespaces[0]}
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-foreobject rounded-box w-52">
                    {modpack_bullets}
                </ul>
            </div>
        </div>
    );
}
function generateModpackSelector(modpack_namespace) {
    // if (modpack_namespace == Settings.getSelectedModpack()) return <div key={modpack_namespace} />;

    const modpack_name = modpack_namespace;
    const on_click = modpackOnClickFunction(modpack_namespace);
    return (
        <li onClick={on_click} key={modpack_namespace}>
            <a>
                {modpack_name}
            </a>
        </li>
    );
}
function modpackOnClickFunction(modpack_namespace) {
    return () => {
        Settings.setSelectedModpack(modpack_namespace);
    };
}
