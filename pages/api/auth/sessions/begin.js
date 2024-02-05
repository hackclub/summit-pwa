import { findAttendee } from "@/lib/airtable";
import sendgrid, { loginCodeEmail }  from "@/lib/email";
import Session from "@/lib/sessions";
import { setCookie } from "cookies-next";

const oneWeek = 60 * 60 * 24 * 7;

export default async function handler(req, res) {
  const attendee = await findAttendee(req.body.email);

  if (!attendee) return res.json({ registered: false });

  const session = await Session.create(attendee.fields.email);
  setCookie("session", session.id, { req, res, maxAge: oneWeek });

  const loginCode = await session.generateLoginCode();

  try {
    await sendgrid.send({
      to: attendee.fields.email,
      from: `${process.env.SENDGRID_NAME} <${process.env.SENDGRID_EMAIL}>`,
      replyTo: "summit@hackclub.com",
      subject: `Leaders Summit Login Code: ${loginCode}`,
      ...loginCodeEmail(loginCode, attendee)
    });
  } catch (err) {
    console.error(err);
    console.error(err.response.body.errors);
  }

  return res.json({ registered: true, codeSent: true });
}
