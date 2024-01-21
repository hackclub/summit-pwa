const AirtablePlus = require("airtable-plus");

const registrationsTable = new AirtablePlus({
  baseID: "appflCE02W8uhLPlI",
  apiKey: process.env.AIRTABLE_KEY,
  tableName: "Attendees"
});

export async function findAttendee(email) {
  return await registrationsTable
    .read({
      filterByFormula: `email = "${email}"`,
      maxRecords: 1
    })
    .then((records) => (records.length > 0 ? records[0] : null));
}
