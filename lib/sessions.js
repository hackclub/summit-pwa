import { kv } from "@vercel/kv";
import { findAttendee } from "@/lib/airtable";
const { uuid } = require("uuidv4");

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const getLoginCode = () =>
  "******"
    .split("")
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");

export function create(email) {
  const sessionId = uuid();

  kv.set("sessions." + sessionId, {
    email,
    created: new Date().toISOString(),
    authorized: false,
    loginCode: null
  });

  return {
    sessionId
  };
}

export async function generateLoginCode(sessionId) {
  const session = await kv.get("sessions." + sessionId);

  const newSession = {
    ...session,
    loginCode: getLoginCode()
  };

  await kv.set("sessions." + sessionId, newSession);
  return newSession;
}

export async function loginWithCode(sessionId, loginCode) {
  console.log(sessionId)
  const session = await kv.get("sessions." + sessionId);
  console.log(session)
  if (session && session.loginCode && session.loginCode == loginCode) {
    return kv.set("sessions." + sessionId, {
      ...session,
      authorized: true
    });
  }
  return session;
}

export async function currentSession(sessionId) {
  const session = await kv.get("sessions." + sessionId);
  return session && session.authorized ? session : null;
}

export async function currentUser(sessionId) {
  let session = await currentSession(sessionId);
  return session ? await findAttendee(session.email) : null;
}
