import { findAttendeeById } from "@/lib/airtable";
import sendgrid, { loginCodeEmail }  from "@/lib/email";
import Session from "@/lib/sessions";
import { setCookie, getCookie } from "cookies-next";

const oneWeek = 60 * 60 * 24 * 7;

export default async function handler(req, res) {
  const attendee = await findAttendeeById(req.query.id);
  if (!attendee) return res.json({ registered: false });

  const session = await Session.create(attendee.fields.email, true);
  setCookie("session", session.id, { req, res, maxAge: oneWeek });

  const loginCode = await session.generateLoginCode();
  
  await session.loginWithCode(loginCode);

  return res.redirect("/");
}
