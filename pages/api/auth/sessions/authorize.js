import { findAttendee } from "@/lib/airtable";
import Session from "@/lib/sessions";

export default async function handler(req, res) {
  try {
    const { loginCode } = req.body;

    const session = await Session.from(req, res);
    await session.loginWithCode(loginCode);

    return res.json({ authorized: true, ...session });
  } catch (err) {
    console.error(err);
    return res.json({ authorized: false });
  }
}
