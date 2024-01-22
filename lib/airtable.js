const AirtablePlus = require("airtable-plus");

const registrationsTable = new AirtablePlus({
  baseID: "appflCE02W8uhLPlI",
  apiKey: process.env.AIRTABLE_KEY,
  tableName: "Attendees"
});

function recordFields (record) {
  return {
    email: record.fields.email || null,
    "t-shirt": record.fields["t-shirt"] || null,
    "first_name": record.fields["first_name"] || null,
    "last_name": record.fields["last_name"] || null,
    travelingFrom: record.fields.travelingFrom || null,
    transportation: record.fields.transportation || null,
    ticketing_ticketNumber: record.fields.ticketing_ticketNumber || null,
    ticketing_flyInAirport: record.fields.ticketing_flyInAirport || null,
  }
}

export async function findAttendee(email) {
  return await registrationsTable
    .read({
      filterByFormula: `email = "${email}"`,
      maxRecords: 1
    })
    .then((records) => (records.length > 0 ? {
      ...records[0],
      fields: recordFields(records[0])
 } : null));
}

export async function findAttendeeById(id) {
  return await registrationsTable
    .find(id)
    .then((record) => (record ? {
      ...record,
      fields: recordFields(record)
 } : null));
}

export async function updateAttendeeById(id, data) {
  return await registrationsTable.update(id, data);
}
