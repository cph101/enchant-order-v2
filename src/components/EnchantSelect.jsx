import React, { useEffect, useState } from 'react';
import { getStoredEnchants } from '../logic/bridge.mjs';
import { OUTPUT_DATA } from '../logic/bridge.mjs'
import LoadDetector from './LoadDetector';
import * as translator from "../scripts/translation.js";

// {getStoredEnchants().map((name) => {return(  )})} 

function useForceUpdate(){
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

export default function EnchantSelect() {
  const forceUpdate = useForceUpdate();

  document.documentElement.addEventListener("refreshEnchantRender", (event) => {
    forceUpdate();
  });

  return (
    <div className="h-screen px-7">
      <div className="grid grid-cols-8 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-3 mx-auto h-[35%]">
        {OUTPUT_DATA.enchantsHaveLoaded ? (
          getStoredEnchants().map((name) => (
            <div key={Math.random()} className="enchcard text-center">
              <span data-trnskey={"enchants." + name}>Loading...</span>
              <LoadDetector callback={() => {
                translator.searchForComponents();
              }} />
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
