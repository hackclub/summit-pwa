import { findAttendeeById } from "@/lib/airtable";
import sendgrid, { loginCodeEmail }  from "@/lib/email";
import { create, generateLoginCode } from "@/lib/sessions";
import { setCookie } from "cookies-next";

const oneWeek = 60 * 60 * 24 * 7;

export default async function handler(req, res) {
  const attendee = await findAttendeeById(req.query.id);
  if (!attendee) return res.json({ registered: false });

  const { sessionId } = await create(attendee.fields.email, true);
  setCookie("session", sessionId, { req, res, maxAge: oneWeek });

  const { loginCode } = await generateLoginCode(sessionId);
  
  await loginWithCode(sessionId, loginCode);

  return res.redirect("/");
}
