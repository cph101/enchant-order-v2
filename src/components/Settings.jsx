import React from "react";

export default function Settings() {
  return (
    <main>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
      Settings
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Settings</h3>
          <p className="py-4">At the moment this is all there is :P</p>
        </div>
      </dialog>
    </main>
  );
}
