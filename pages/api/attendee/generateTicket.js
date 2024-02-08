import { updateAttendeeById } from "@/lib/airtable";
import Session from "@/lib/sessions";
import { ticketNumber } from "@/utils/ticketNumber";

export default async function generateTicket (req, res) {
  const session = await Session.from(req, res);
  const user = await session.currentAuthorizedUser();

  const number = await ticketNumber(user.fields.first_name + " " + user.fields.last_name, user.fields.email);

  await updateAttendeeById(user.id, {"ticketing_ticketNumber": +number});

  res.json({ success: true });
}