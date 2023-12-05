import React from "react";
import Settings from './Settings.jsx';

export default function Header() {
  return(
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl"><span data-trnskey="h1_title">Enchantment Calculator</span></a>
      </div>
      <div className="flex-none mr-8">
        <Settings />
      </div>
    </div>
  )
}