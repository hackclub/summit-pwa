import { useEffect, useState } from "react";

export default function useBreakpoints (breakpoints = [640, 768, 1024, 1280, 1536]) {
    const [viewportWidth, setViewportWidth] = useState(null);

    useEffect(() => {
        const handleWindowResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize();
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    return function responsive (...styles) {
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (viewportWidth > breakpoints[i]) return styles[i] || styles[styles.length - 1];
        }

        return styles[0];
    }
}
