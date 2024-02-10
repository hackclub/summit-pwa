import Session from "@/lib/sessions";
import { kv } from "@vercel/kv";

export default async function handler (req, res) {
    const session = await Session.from(req, res);

    if (!session.organizer) return res.json({ authorized: false });
    const organizer = await session.currentAuthorizedUser();

    const result = await kv.lpush(`events.irl`, {
        version: 5,
        name: req.body.name,
        data: req.body.data,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(7) + "-" + Date.now()
    });

    res.json({ result });
}