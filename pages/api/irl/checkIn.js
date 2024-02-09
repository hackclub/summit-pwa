import { findAttendeeByNumber, updateAttendeeById } from "@/lib/airtable";
import Session from "@/lib/sessions";

export default async function handler(req, res) {
    const session = await Session.from(req, res);

    if (!session.authorized || !session.organizer) return res.json({ authorized: false });

    try {
  
        const attendee = await findAttendeeByNumber(req.body.ticketNumber);
        updateAttendeeById(attendee.id, { "ticketing_checkedIn": true });
    
        return res.json({ success: (await findAttendeeByNumber(req.body.ticketNumber)).fields.ticketing_checkedIn });
    } catch (err) {
        console.error(err);
        return res.json({ success: false });
    }
}