import React from "react";
import Settings from "./Settings";
import ItemSelect from "./ItemSelect";
import ModpackSelect from "./ModpackSelect";
import { Translator } from "../scripts/Translator";

export default function Header() {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1 m-5 mt-3">
                <h1 data-trnskey="h1_title" className="font-bold text-2xl">
                    Loading...
                </h1>
            </div>
            <div className="flex-none m-5 mt-3">
                <ItemSelect />
                <ModpackSelect />
                <Settings />
            </div>
        </div>
    );
}
