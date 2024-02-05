import { kv } from "@vercel/kv";
import { findAttendee } from "@/lib/airtable";
const { uuid } = require("uuidv4");
import { getCookie } from "cookies-next";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const isInLast15Minutes = () => new Date() > new Date(Date.now() - 15 * 60000);

export default class Session {
  constructor ({
    id = Session.utils.sessionId(),
    email,
    created = new Date().toISOString(),
    authorized = false,
    loginCode = null,
    limited = false,
    role = "leader"
  }) {
    this.id = id;
    this.email = email;
    this.created = new Date(created);
    this.authorized = authorized;
    this.loginCode = loginCode;
    this.limited = limited;
    this.role = role;
  }

  async generateLoginCode () {
    this.loginCode = Session.utils.loginCode();
    await this.save();

    return this.loginCode;
  }

  async loginWithCode (loginCode) {
    if (this.loginCode == loginCode && isInLast15Minutes(this.created)) {
      this.authorized = true;
    }

    await this.save();
    return this.authorized;
  }
  
  async save () {
    await kv.set("sessions." + this.id, {
      email: this.email,
      created: this.created.toISOString(),
      authorized: this.authorized,
      loginCode: this.loginCode,
      limited: this.limited,
      role: this.role
    });
  }

  async currentUser () {
    return await findAttendee(this.email);
  }

  async currentAuthorizedUser () {
    if (!this.authorized) return null;

    return await findAttendee(this.email);
  }

  static async find (sessionId) {
    const sessionData = await kv.get("sessions." + sessionId);

    return new Session({ id: sessionId, ...sessionData });
  }

  static async currentUser (sessionId) {
    const session = await Session.find(sessionId);

    return await session.currentUser();
  }

  static async currentAuthorizedUser (sessionId) {
    const session = await Session.find(sessionId);

    return await session.currentAuthorizedUser();
  }

  static async create (email, limited = false) { // allow "limited" sessions for quick attendee actions that can be force-expired
    const session = new Session({
      email,
      limited
    });

    await session.save();

    return session;
  }

  static async from (req, res) {
    return Session.find(getCookie("session", { req, res }));
  }

  static utils = {
    loginCode () {
      return "******".split("").map(_ => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
    },
    sessionId () {
      return uuid();
    }
  }
}
