// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { generatePass } from "@/lib/pass";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/vnd.apple.pkpass");

  res.send(await generatePass());
}
