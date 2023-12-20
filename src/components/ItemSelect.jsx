import React, { useState } from 'react';
import { Settings } from "../scripts/settings.js";

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
    // A function that increment 👆🏻 the previous state like here 
    // is better than directly setting `setValue(value + 1)`
}

export default function ItemSelect() {
  let items = ["Sword", "Shield", "Chestplate", "Boots", "Helmet", "Carrot on Stick", "Chestplate", "Leggings"];

  let selectedItem = new Settings().getSetting('selectedItem');

  const chooseItem = (item) => {
    const elem = document.activeElement;
    if(elem){
      elem?.blur();
    }
    new Settings().updateSetting('selectedItem', item);
    selectedItem = item;
  };
  
  const forceUpdate = useForceUpdate();
  
  return(
    <div id="itemSelect" className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1"><img src={"/enchant-order-v2/images/" + selectedItem + ".png"}/>{selectedItem}</div>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {items.map((itemname, i) => {
          if (itemname != selectedItem) {
            return(
              <li onClick={function(event) { chooseItem(itemname); forceUpdate()}} key={itemname}><a><img src={"/images/" + itemname + ".png"}/>{itemname}</a></li>
            );
          } else {
            return(<div key={itemname}></div>);
          }
        })}
      </ul>
    </div>
  )
}