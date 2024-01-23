import { findAttendee } from "@/lib/airtable";
import sendgrid, { loginCodeEmail }  from "@/lib/email";
import { create, generateLoginCode } from "@/lib/sessions";
import { setCookie } from "cookies-next";

const oneWeek = 60 * 60 * 24 * 7;

export default async function handler(req, res) {
  const attendee = await findAttendee(req.body.email);
  if (!attendee) return res.json({ registered: false });

  const { sessionId } = await create(attendee.fields.email);
  setCookie("session", sessionId, { req, res, maxAge: oneWeek });

  const { loginCode } = await generateLoginCode(sessionId);

  await sendgrid.send({
    to: attendee.fields.email,
    from: "Hack Club Team <team@hackclub.com>",
    replyTo: "summit@hackclub.com",
    subject: `Leaders Summit Login Code: ${loginCode}`,
    ...loginCodeEmail(loginCode, attendee)
  });

  return res.json({ registered: true, codeSent: true });
}
