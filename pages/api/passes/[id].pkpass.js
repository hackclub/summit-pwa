// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { findAttendeeByPassId } from "@/lib/airtable";
import { generatePass } from "@/lib/pass";

export default async function handler(req, res) {
  const { id } = req.query;

  const user = findAttendeeByPassId(id);

  res.setHeader("Content-Type", "application/vnd.apple.pkpass");

  res.send(await generatePass({ user }));
}
