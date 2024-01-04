import React from 'react';

export default function EnchantSelect() {
 return(
   <div className="h-screen">
       <div className="grid grid-cols-8 md:grid-cols-8 grid-rows-3 md:grid-rows-2 gap-3 mx-auto h-[35%]">
           <div className="enchcard text-center">
             Fire Aspect
           </div>
          <div className="enchcard text-center">
             Smite
           </div>
         <div className="enchcard text-center">
            Sharpness
          </div>
       </div>
   </div> 

)
}