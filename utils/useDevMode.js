import { useEffect, useState } from "react";

export default function useDevMode () {
    const [devMode, setDevMode] = useState(false);

    useEffect(() => {
        if (globalThis.localStorage) {
            setDevMode(localStorage.getItem("devmode") === "true");
        }

        if (globalThis.window) {
            window.dev = new Proxy({}, {
                get: (_, prop) => {
                    if (prop == "on") return (() => {
                        localStorage.setItem("devmode", "true");
                        location.reload();
                    })();
                    if (prop == "off") return (() => {
                        localStorage.setItem("devmode", "false");
                        location.reload();
                    })();
                }
            })
        }
    }, []);

    return devMode;
}