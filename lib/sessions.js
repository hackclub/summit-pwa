import { kv } from "@vercel/kv";
import { findAttendee } from "@/lib/airtable";
const { uuid } = require("uuidv4");

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const isInLast15Minutes = () => new Date() > new Date(Date.now() - 15 * 60000);

const getLoginCode = () =>
  "******"
    .split("")
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");

export async function create(email) {
  const sessionId = uuid();

  await kv.set("sessions." + sessionId, {
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
  const session = await kv.get("sessions." + sessionId);
  if (session && session.loginCode && session.loginCode == loginCode && isInLast15Minutes(new Date(session.created))) {
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
