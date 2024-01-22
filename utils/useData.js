import { useEffect, useState } from "react";

export default function useData (fetcher, initial) {
    const [data, setData] = useState(initial);
    
    useEffect(() => {
        (async () => setData(await fetcher()))();
    }, []);

    return data;
}
