import React, { useState, useEffect } from 'react';
import { Settings } from "../scripts/settings.js";

function useForceUpdate(){
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default function ItemSelect() {
  let items = { "combat" : ["Sword", "Mace", "Trident", "Axe", "Bow", "Crossbow", "-", "Turtle Shell", "Helmet", "Chestplate", "Leggings", "Boots", "Shield"], "utilities" : ["Hoe", "Pickaxe", "Shovel", "Brush", "Shears", "Flint and Steel", "-", "Pumpkin", "Elytra", "Fishing Rod", "Carrot on a Stick", "Warped fungus on a Stick", "Book"]}; 

  let selectedItem = new Settings().getSetting('selectedItem');

  let selectedTab = new Settings().getSetting('selectedTab');

  /*useEffect(() => {
    const myEvent = new CustomEvent("test", {
      detail: {},
    });
    document.documentElement.dispatchEvent(myEvent);
  });*/

  const getTabClassNames = (tab) => {
    if (selectedTab == tab) {
      return "tab tab-selected itemSelectTab";
    } else {
      return "tab itemSelectTab";
    }
  }
  
  const chooseItem = (item) => {
    const elem = document.activeElement;
    if(elem){
      elem?.blur();
    }
    new Settings().updateSetting('selectedItem', item);
    selectedItem = item;

    const myEvent = new CustomEvent("test", {
      detail: {},
    });
    document.documentElement.dispatchEvent(myEvent);
  };

  const setTabTo = (tab) => {
    new Settings().updateSetting('selectedTab', tab);
    selectedTab = tab;
  };
  
  const forceUpdate = useForceUpdate();
  
  return(
    <div id="itemSelect" className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1 bg-foreobject"><img src={"/enchant-order-v2/images/" + selectedItem.toLowerCase().replaceAll(" ", "_") + ".gif"} className="itemSelectImage"/>{selectedItem}</div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-foreobject rounded-box w-52">
        <div role="tablist" className="tabs tabs-bordered">
          <a role="tab" onClick={function(event) { setTabTo("combat"); forceUpdate()}} className={getTabClassNames("combat")}>Combat</a>
          <a role="tab" onClick={function(event) { setTabTo("utilities"); forceUpdate()}} className={getTabClassNames("utilities")}>Utilities</a>
        </div>
        {items[selectedTab].map((itemname, i) => {
          if (itemname == "-") {
            return(<div key={itemname} className="divider"></div>)
          } else if (itemname != selectedItem) {
            return(
              <li onClick={function(event) { chooseItem(itemname); forceUpdate()}} key={itemname}><a><img src={"/enchant-order-v2/images/" + itemname.toLowerCase().replaceAll(" ", "_") + ".gif"} className="itemSelectImage"/>{itemname}</a></li>
            );
          } else {
            return(<div key={itemname}></div>);
          }
        })}
      </ul>
    </div>
  )
}