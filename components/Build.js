import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Build ({ style }) {
    const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring?.(0, 7) || false;

    return (
        <span style={style || {}}>
            Hack Club Leaders Summit • {sha == false ? "Development" : (
                <>Build <code>{sha}</code></>
            )}
        </span>
    )
}