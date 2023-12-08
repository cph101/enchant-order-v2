import React from 'react';

export default function EnchantSelect() {
 return(
   <div className="h-screen">
       <div className="grid grid-cols-2 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-3 h-[25%] w-[95%] mx-auto">
           <div className="bg-pink-100 row-span-1 col-span-1">
               <span>Fire Aspect</span>
           </div>
           <div className="bg-orange-100">
               <span>Sharpness</span>
           </div>
           <div className="bg-amber-100">
               <span>Knockback</span>
           </div>
           <div className="bg-violet-100 ">
               <span>Mending</span>
           </div>
           <div className="bg-fuchsia-100">
               <span>Unbreaking</span>
           </div>
           <div className="bg-blue-100 ">
               <span>Smite</span>
           </div>

       </div>
   </div> 

)
}