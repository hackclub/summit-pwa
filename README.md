# Summit PWA

This is a Next.js web app that: collects additional information from participants, generates tickets, and has a schedule for participants to reference.

Here's the tech it uses:

* Next.js
* Airtable (where we store all the information about attendees!)
* Vercel KV (storing session data)
* Fillout (form software used for collecting additional information)

## Development

Install dependencies with `npm install` and get going with `npm run dev`.

### Environment Variables

If you have access to Hack Club's Vercel, you can pull the environment variables with the following commands:

```sh
# To use production data and integrations
vercel env pull --environment=production

# To use development data and integrations
vercel env pull --environment=development
```

If you don't have access to Hack Club's Vercel, we've pinned the development environment variables in the `#summit-app` channel on Slack. Put these in the `.env.local` file.