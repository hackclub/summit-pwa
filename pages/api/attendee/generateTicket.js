import { findAttendeeById, updateAttendeeById } from "@/lib/airtable";
import Session from "@/lib/sessions";
import { ticketNumber } from "@/utils/ticketNumber";

export default async function generateTicket (req, res) {
  const session = await Session.from(req, res);
  const user = await session.currentAuthorizedUser();

  if (!user || user.fields.ticketing_ticketNumber || !user.fields.ticketing_flyInAirport) {
    return res.redirect("https://www.youtube.com/watch?v=H947PtHmh0Y"); // @sampoder: i take full responsibility here, sorry.
  }
  
  const number = await ticketNumber(user.fields.first_name + " " + user.fields.last_name, user.fields.email);

  await updateAttendeeById(recordId, {"ticketing_ticketNumber": +number});

  return res.redirect("/dashboard");
}