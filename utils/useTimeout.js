import { useEffect } from "react";

export default function useTimeout (callback, time) {
    useEffect(() => {
        const interval = setTimeout(() => {
            callback();
        }, time);
        return () => clearTimeout(interval);
    }, []);
}