import { useState } from "react";
import { Settings } from "../scripts/Settings";
import { Metadata } from "../scripts/Data";
import { Slide, toast } from "react-toastify";
import { Translator } from "../scripts/Translator";

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ItemSelect() {
    const forceUpdate = useForceUpdate();
    $('html').on("RefreshItemSelect", forceUpdate);

    const tab2item_namespaces = Metadata.getLayout();
    const modpack_is_loaded = Metadata.modpackIsLoaded;
    return (
        <div>
            {modpack_is_loaded ? generateItemSelectors(tab2item_namespaces) : ""}
        </div>
    );
}

function generateItemSelectors(tab2item_namespaces) {
    const selected_item_namespace = Settings.getSelectedItem();
    const selected_item_section = generateSelectedItemDisplay(selected_item_namespace);
    const tab_page = generateTabPage(tab2item_namespaces);
    return (
        <div id="itemSelect" className="dropdown">
            {selected_item_section}
            {tab_page}
        </div>
    );
}

function generateTabPage(tab2item_namespaces) {
    const tabs = generateTabs(Object.keys(tab2item_namespaces));
    const item_namespaces_in_tab = tab2item_namespaces[Settings.getSelectedTab()];
    const item_bullets = item_namespaces_in_tab.map(generateItemSelector);
    return (
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-foreobject rounded-box w-52">
            {tabs}
            {item_bullets}
        </ul>
    );
}
function generateTabs(tab_namespaces) {
    return (
        <div role="tablist" className="tabs tabs-bordered">
            {tab_namespaces.map(generateTab)}
        </div>
    );
}
function generateTab(tab_namespace) {
    const tab_name = Metadata.tabNamespaceToName(tab_namespace);
    const key = Math.random();
    const class_name = generateTabClassNames(tab_namespace);
    const on_click = tabOnClickFunction(tab_namespace);
    return (
        <a key={key} role="tab" onClick={on_click} className={class_name}>
            {tab_name}
        </a>
    );
}
function tabOnClickFunction(tab_namespace) {
    return () => {
        Settings.setSelectedTab(tab_namespace);
    };
}

function generateSelectedItemDisplay(item_namespace) {
    const item_name = Metadata.itemNamespaceToName(item_namespace);
    const item_icon = generateItemIcon(item_namespace);
    return (
        <div tabIndex={0} role="button" className="btn m-1 bg-foreobject">
            {item_icon}
            {item_name}
        </div>
    );
}
function generateItemSelector(item_namespace) {
    if (item_namespace == "-") return <div key={item_namespace} className="divider" />;
    if (item_namespace == Settings.getSelectedItem()) return;

    const item_name = Metadata.itemNamespaceToName(item_namespace);
    const item_icon = generateItemIcon(item_namespace);
    const on_click = itemOnClickFunction(item_namespace);
    return (
        <li onClick={on_click} key={item_namespace}>
            <a>
                {item_icon}
                {item_name}
            </a>
        </li>
    );
}

function itemOnClickFunction(item_namespace) {

    const itemActualName = Metadata.itemNamespaceToName(item_namespace);
    const modpackName = Settings.getSelectedModpack();

    const errorTextFallback = "No enchants were found for item \"{0}\" in modpack \"{1}\"";

    const wouldBeErrorText =
        Translator.getWPlaceholdersWFallback("errors.noenchantsfound", errorTextFallback, 
        itemActualName, modpackName);

    return () => {
        if (Metadata.itemToEnchantmentNames(item_namespace).length == 0) {
            toast.error(wouldBeErrorText, {
                position: "bottom-right",
                closeOnClick: false,
                draggable: false,
                theme: "colored",
                transition: Slide,
                closeButton: false,
                icon: <ion-icon name="warning-outline" class="ionicon-xl"></ion-icon>,
                className: "enchants-not-found-toast"
                });
        } else Settings.setSelectedItem(item_namespace);
    };
}

function generateItemIcon(item_namespace) {
    const icon_filepath = "/enchant-order-v2/images/" + item_namespace + ".gif";
    const item_icon = <img src={icon_filepath} className="itemSelectImage" />;
    return item_icon;
}

function generateTabClassNames(tab_namespace) {
    const selected_tab_namespace = Settings.getSelectedTab();
    if (selected_tab_namespace == tab_namespace) return "tab tab-selected item-select-tab";
    return "tab item-select-tab";
}
