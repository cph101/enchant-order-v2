import { useEffect } from "react";
import { themeChange } from "theme-change";

export default function Footer() {
    useEffect(() => {
        themeChange(false);
    }, []);

    const themes = ["light", "dark", "crimson"];

    return (
        <main>
            <footer className="custom-content footer bg-foreobject-100">
                {generateThemeSwitchers(themes)}
                {generateCreditSelectors()}
            </footer>
            {generateCreditsModal()}
        </main>
    );
}

function generateThemeSwitchers(themes) {
    return (
        <div className="dark-mode-toggle-container">
            <div id="theme-switcher-form">
                {themes.map(generateThemeSwitcher)}
            </div>
        </div>
    );
}
function generateThemeSwitcher(theme, index) {
    return (
        <div data-theme={theme} className="themeChoice" key={index}>
            <input
                type="radio"
                id={`${theme}-theme`}
                name="theme-choice"
                value={`${theme}-theme`}
                selected="selected"
            />
            <label
                className={index === 0 ? "isActivelol" : ""}
                data-act-class="isActivelol"
                data-set-theme={theme}
                htmlFor="light-theme"
            />
        </div>
    );
}

function generateCreditSelectors() {
    return (
        <p>
            <a onClick={showCreditsModal} className="text-link" data-trnskey="credits">
                Credits
            </a>
            {" | "}
            <a href="https://github.com/cph101/enchant-order-v2" className="text-link" data-trnskey="gitlink">
                Loading...
            </a>
        </p>
    );
}

function generateCreditsModal() {
    return (
        <dialog id="creditsModal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg" data-trnskey="credits">
                    Loading...
                </h3>
                <div className="w-full h-8 flex flex-row mt-4">
                    <div className="basis-1/10 my-auto">
                        <img className="rounded-full h-6" src="https://avatars.githubusercontent.com/u/173750?v=4" />
                    </div>
                    <div className="basis-9/10 my-auto ml-2">
                        Cal Henderson • <span data-trnskey="calcredit">Loading...</span>
                    </div>
                </div>
                <div className="w-full h-8 flex flex-row mt-2">
                    <div className="basis-1/10 my-auto">
                        <img className="rounded-full h-6" src="https://avatars.githubusercontent.com/u/79333877?v=4" />
                    </div>
                    <div className="basis-9/10 my-auto ml-2">
                        jmarcinik3 • <span data-trnskey="marcicredit">Loading...</span>
                    </div>
                </div>
                <div className="w-full h-8 flex flex-row my-2">
                    <div className="basis-1/10 my-auto">
                        <img className="rounded-full h-6" src="https://avatars.githubusercontent.com/u/93673699?v=4" />
                    </div>
                    <div className="basis-9/10 my-auto ml-2">
                        cph101 • <span data-trnskey="cphcredit">Loading...</span>
                    </div>
                </div>
                <span className="italic text-xs opacity-30" data-trnskey="creditsnotice">
                    Loading...
                </span>
            </div>
        </dialog>
    );
}
function showCreditsModal() {
    document.getElementById("creditsModal").showModal();
}
