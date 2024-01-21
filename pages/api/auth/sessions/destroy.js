import { deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  deleteCookie("session", { req, res });
  return res.json({ authorized: false });
}
