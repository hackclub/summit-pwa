import Session from "@/lib/sessions";
import { kv } from "@vercel/kv";

export default async function handler (req, res) {
    const session = await Session.from(req, res);

    if (!session.organizer) return res.json({ authorized: false });
    const organizer = await session.currentAuthorizedUser();

    const result = await kv.lrange(`events.${organizer.id}`, 0, -1);

    res.json({ messages: result.filter(result => result.version >= 5).sort((a, b) => a.timestamp - b.timestamp) });
}