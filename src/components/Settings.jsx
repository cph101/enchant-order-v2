import React from "react";

export default function Settings() {
  return (
    <main>
      <button
        data-trnskey="settings"
        className="btn"
        onClick={() => document.getElementById("mainSettings").showModal()}
      >
        Loading...
      </button>
      <dialog id="mainSettings" className="modal ">
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 data-trnskey="settings" className="font-bold text-lg">
            Loading...
          </h3>
          <div className="overflow-x-auto mt-6">
            <div className="label">
              <span data-trnskey="language" className="label-text">
                Loading...
              </span>
            </div>
            <select
              data-property="languageSelect"
              className="select-bordered select w-full max-w-xs"
            ></select>
          </div>
        </div>
      </dialog>
    </main>
  );
}
