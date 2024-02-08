import { findAttendee } from "@/lib/airtable";
import Session from "@/lib/sessions";

export default async function handler(req, res) {
  try {
    const { loginCode } = req.body;

    const session = await Session.from(req, res);
    const authorized = await session.loginWithCode(loginCode);

    const user = await session.currentUser();

    return res.json({ authorized, ticketGenerated: user.fields.ticketing_ticketNumber && authorized, ...session });
  } catch (err) {
    console.error(err);
    return res.json({ authorized: false });
  }
}
