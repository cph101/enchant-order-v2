import React, { useState, useEffect } from 'react';
import { Settings } from "../scripts/settings.js";

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ItemSelect() {
  let tab2item_names = {
    "combat": [
      "Sword", "Mace", "Trident", "Axe", "Bow", "Crossbow",
      "-",
      "Turtle Shell", "Helmet", "Chestplate", "Leggings", "Boots", "Shield"
    ],
    "utilities": [
      "Hoe", "Pickaxe", "Shovel", "Brush", "Shears", "Flint and Steel",
      "-",
      "Pumpkin", "Elytra", "Fishing Rod", "Carrot on a Stick", "Warped fungus on a Stick", "Book"
    ]
  }; 
  let selectedItem = new Settings().getSetting('selectedItem');
  let selectedTab = new Settings().getSetting('selectedTab');

  /*useEffect(() => {
    const myEvent = new CustomEvent("test", {
      detail: {},
    });
    document.documentElement.dispatchEvent(myEvent);
  });*/

  function generateTabClassNames(tab) {
    if (selectedTab == tab) return "tab tab-selected itemSelectTab";
    return "tab itemSelectTab";
  }

  function generateTab(tab_namespace) {
    const tab_name = tab_namespace[0].toUpperCase() + tab_namespace.substring(1);
    const on_click_function = () => {
      setSelectedTab(tab_namespace);
      forceUpdate();
    };
    const class_name = generateTabClassNames(tab_namespace);
    return <a role="tab" onClick={on_click_function} className={class_name}>{tab_name}</a>;
  }

  function generateItemSelection(item_name) {
    if (item_name == "-") return <div key={item_name} className="divider"></div>;

    if (item_name != selectedItem) {
      const on_click_function = () => {
        setSelectedItem(item_name);
        forceUpdate();
      };
      const item_icon = generateItemIcon(item_name);

      return (
        <li onClick={on_click_function} key={item_name}>
          <a>
            {item_icon}
            {item_name}
          </a>
        </li>
      );
    }

    return(<div key={item_name}></div>);
  }
  
  function setSelectedItem (item) {
    const elem = document.activeElement;
    if (elem) elem?.blur();

    new Settings().updateSetting('selectedItem', item);
    selectedItem = item;

    const myEvent = new CustomEvent("test", {
      detail: {},
    });
    document.documentElement.dispatchEvent(myEvent);
  };

  function setSelectedTab(tab) {
    new Settings().updateSetting('selectedTab', tab);
    selectedTab = tab;
  };
  
  const forceUpdate = useForceUpdate();

  const selected_item_icon = generateItemIcon(selectedItem);
  const selected_item_section = <div tabIndex={0} role="button" className="btn m-1 bg-foreobject">
    {selected_item_icon}
    {selectedItem}
  </div>;

  const tabs = <div role="tablist" className="tabs tabs-bordered">
    {generateTab("combat")}
    {generateTab("utilities")}
  </div>;
  const item_names_in_tab = tab2item_names[selectedTab];
  const item_bullets = item_names_in_tab.map(generateItemSelection);
  const tab_section = <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-foreobject rounded-box w-52">
    {tabs}
    {item_bullets}
  </ul>;

  return(
    <div id="itemSelect" className="dropdown">
      {selected_item_section}
      {tab_section}
    </div>
  )
}

function generateItemIcon(item_name) {
  const item_namespace = item_name.toLowerCase().replaceAll(" ", "_");
  const icon_filepath = "/enchant-order-v2/images/" + item_namespace + ".gif";
  const item_icon = <img src={icon_filepath} className="itemSelectImage" />;
  return item_icon;
}