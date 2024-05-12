import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

import "react-toastify/dist/ReactToastify.css";
import "./css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
