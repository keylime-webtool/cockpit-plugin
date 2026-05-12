import "@patternfly/patternfly/patternfly.css";
import "./keylime.scss";
import { createRoot } from "react-dom/client";
import { App } from "./App";

document.addEventListener("DOMContentLoaded", () => {
    const root = createRoot(document.getElementById("app") as HTMLElement);
    root.render(<App />);
});
