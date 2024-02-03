// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { findAttendeeByPassId } from "@/lib/airtable";
import { generatePass } from "@/lib/pass";

export default async function handler(req, res) {
  const { id } = req.query;

  const user = await findAttendeeByPassId(id);

  if (!user) {
    return res.send("Error, invalid link");
  }

  res.setHeader("Content-Type", "application/vnd.apple.pkpass");

  res.send(await generatePass({ user }));
}
