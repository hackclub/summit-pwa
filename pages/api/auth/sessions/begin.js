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
    text: `Hello! You recently requested a login code for The Summit. Here it is:\n${loginCode}.\n\nDon't share this code with anyone.`,
    html: `
      <p>Hello! You recently requested a login code for The Summit. Here it is:</p>
      <pre style="text-align:center;background-color:#ebebeb;padding:8px 0;font-size:1.5em;border-radius:4px"><b>${loginCode}</b></pre>
      <p>We'll see you at The Summit!</p>
      <p>- Hack Club Team</p>
      <p><small>Don't share this code with anyone as it gives full access to your ticket and registration.</small>
    `,
  });

  return res.json({ registered: true, codeSent: true });
}
