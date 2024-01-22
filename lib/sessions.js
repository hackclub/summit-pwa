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

// export default class Session {
//     constructor (sessionId) {
//         this.sessionId = sessionId;
//         this.loaded = false;
//         this.data = {};
//     }

//     async load () {
//         this.data = await kv.get("sessions." + this.sessionId);
//         this.loaded = true;
//     }

//     async update () {
//         await kv.set("sessions." + this.sessionId, this.data);
//     }

//     async generateLoginCode () {
//         await this.load();
//         this.data.loginCode = getLoginCode();
//         await this.update();

//         return this.data.loginCode;
//     }

//     async loginWithCode(loginCode) {
//         this.load();
//         if (this.data && this.data.loginCode && this.data.loginCode == loginCode && isInLast15Minutes(new Date(this.data.created))) {
//             this.data.authorized = true;
//         }
//         await this.update();
//         return this.data.authorized;
//     }

//     async currentUser () {
//         await this.load();
//         return this.data.authorized ? await findAttendee(this.data.email) : null;
//     }

//     static async create (email) {
//         const session = new Session(uuid());

//         session.data = {
//             email,
//             created: new Date().toISOString(),
//             authorized: false,
//             loginCode: null
//         };

//         await session.update();

//         return session;
//     }
// }
