import { findAttendee } from "@/lib/airtable";
import { loginWithCode, currentSession } from "@/lib/sessions";
import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  const { loginCode } = req.body;
  let sessionId = getCookie("session", { req, res });
  await loginWithCode(sessionId, loginCode);
  let session = await currentSession(sessionId);
  console.log(session ? { authorized: true, ...session } : { authorized: false })
  return res.json(
    session ? { authorized: true, ...session } : { authorized: false }
  );
}
