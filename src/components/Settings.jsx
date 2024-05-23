import React, { useState } from "react";
import { Translator } from "../scripts/Translator";

export default function Settings() {

    const [criticalSettingChanged, setChangeCritSetting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const onModalClose = () => {
        if (criticalSettingChanged) window.location.reload();
    }

    const changePageLanguage = (event) => {
        Translator.changePageLanguage(event.target.value);
        setChangeCritSetting(true);
    }


    const getMenuItems = () => {
        const menuItems = [
            { name: "Miscellaneous", icon: "sparkles" },
            { name: "Mods", icon: "prism" },
            { name: "Themes", icon: "color-palette" }
        ]

        return (
            menuItems.map((tab, index) => {
                return <li key={index} className={
                    "p-[7px] my-2 rounded-lg" + (activeTab == index ? " bg-foreobject-100" : " bg-foreobject-200 opacity-80")
                } onClick={() => setActiveTab(index)}><ion-icon class="translate-y-[2px] translate-x-[2px]" name={tab.icon + "-outline"}></ion-icon>&nbsp;&nbsp;{tab.name}</li>
            })
        )
    }

    const getMiscSettings = () => {
        return (
            <div className="min-h-full p-5">
                <h3 className="font-bold text-xl">
                    <span>Miscellaneous</span>
                </h3>
                <div className="overflow-x-auto mt-6">
                    <div className="label">
                        <span data-trnskey="language" className="label-text">
                            Language
                        </span>
                    </div>
                    <select id="settings-lang-select" className="select-bordered select w-full max-w-xs" onChange={(e) => changePageLanguage(e)}>
                        {Translator.getAvailableLanguages().map(([key, displayname]) => {
                            return <option key={key} value={key}>{displayname}</option>
                        })}
                    </select>
                </div>
                <div className="overflow-x-auto mt-6">
                    <div className="label">
                        <span data-trnskey="optmzforbalance" className="label-text float-left">
                            Optimize for trade rebalance
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <input type="checkbox" className="checkbox mr-auto settings-checkbox" />
                    </div>
                </div>
            </div>
        )
    }

    const getAdequateSettings = () => {
        switch (activeTab) {
            case 0:
                return getMiscSettings();
            case 2:
                return <div></div>
            default:
                return getMiscSettings();
        }
    }

    return (
        <main>
            <button className="btn bg-foreobject-100 settings-opener" onClick={() => $("#mainSettings").get(0).showModal()}>
                <ion-icon name="cog-outline" class="ionicon-xl"></ion-icon>
                <span data-trnskey="settings">Settings</span>
            </button>
            <dialog id="mainSettings" className="modal">
                <div className="modal-box max-w-l flex p-0">
                    <form method="dialog">
                        <button className="btn-sm btn-ghost btn-circle absolute right-2 top-2 bg-[rgba(0,0,0,0.14)]" onClick={onModalClose} >
                            <ion-icon name="close-outline" class="ionicon-xl translate-y-[2.5px]"></ion-icon>
                        </button>
                    </form>
                    <div className="min-h-full bg-[rgba(0,0,0,0.07)] p-5 pt-[17.5px]">
                        <h3 className="font-bold text-2xl">
                            <span data-trnskey="settings">Settings</span>
                        </h3>
                        <ul className="pt-1.5 mt-2.5">
                            {getMenuItems()}
                        </ul>
                    </div>
                    {getAdequateSettings()}
                </div>
            </dialog>
        </main>
    );
}
