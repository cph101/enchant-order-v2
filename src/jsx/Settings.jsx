import React from "react";

export default function Settings() {
    return (
        <main>
            <button className="btn bg-foreobject" onClick={() => document.getElementById("mainSettings").showModal()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                    />
                </svg>{" "}
                <span data-trnskey="settings">Loading...</span>
            </button>
            <dialog id="mainSettings" className="modal">
                <div className="modal-box max-w-md">
                    <form method="dialog">
                        <button className="btn-sm btn-ghost btn-circle absolute right-2 top-2 bg-[rgba(0,0,0,0.14)]">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">
                        <span data-trnskey="settings">Loading...</span>
                    </h3>
                    <div className="overflow-x-auto mt-6">
                        <div className="label">
                            <span data-trnskey="language" className="label-text">
                                Loading...
                            </span>
                        </div>
                        <select data-property="languageSelect" className="select-bordered select w-full max-w-xs" />
                    </div>
                    <div className="overflow-x-auto mt-6">
                        <div className="label">
                            <span data-trnskey="optmzforbalance" className="label-text float-left">
                                Loading...
                            </span>
                            &nbsp;&nbsp;&nbsp;
                            <input type="checkbox" className="checkbox mr-auto settings-checkbox" />
                        </div>
                    </div>
                </div>
            </dialog>
        </main>
    );
}
