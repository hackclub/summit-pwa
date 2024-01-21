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
    .then((records) => (records.length > 0 ? {
      ...records[0],
      fields: {
        email: records[0].fields.email,
        "t-shirt": records[0].fields["t-shirt"],
        "first_name": records[0].fields["first_name"],
        "last_name": records[0].fields["last_name"],
        travelingFrom: records[0].fields.travelingFrom,
        transportation: records[0].fields.transportation
      }
 } : null));
}
