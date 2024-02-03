const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


class SummitEventTicket {

  constructor() {

    this.baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';
    this.batchUrl = 'https://walletobjects.googleapis.com/batch';
    this.classUrl = `${this.baseUrl}/eventTicketClass`;
    this.objectUrl = `${this.baseUrl}/eventTicketObject`;
    this.classSuffix = "thesummit";
    this.issuerID = process.env.GOOGLE_ISSUER_ID

    this.auth();
  }

  auth() {
    this.httpClient = new GoogleAuth({
      credentials: JSON.parse(Buffer.from(process.env.GOOGLE_IS_DUMB, "base64")),
      scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
    });
  }

  async createObject({ user }) {
    let response;

    const objectSuffix = user.fields.ticketing_ticketNumber;

    // Check if the object exists
    try {
      response = await this.httpClient.request({
        url: `${this.objectUrl}/${issuerId}.${objectSuffix}`,
        method: 'GET'
      });

      console.log(`Object ${issuerId}.${objectSuffix} already exists!`);

      return `${issuerId}.${objectSuffix}`;
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        // Something else went wrong...
        console.log(err);
        return `${issuerId}.${objectSuffix}`;
      }
    }

    // See link below for more information on required properties
    // https://developers.google.com/wallet/tickets/events/rest/v1/eventticketobject
    let newObject = {
      'id': `${issuerId}.${this.objectSuffix}`,
      'classId': `${issuerId}.${this.classSuffix}`,
      'state': 'ACTIVE',
      'textModulesData': [
        {
          'header': 'Text module header',
          'body': 'Text module body',
          'id': 'TEXT_MODULE_ID'
        }
      ],
      'barcode': {
        'type': 'QR_CODE',
        'value': user.fields.ticketing_ticketNumber
      },
      'ticketHolderName': `${user.fields.first_name} ${user.fields.last_name}`,
      'ticketNumber': 'Ticket number'
    };

    response = await this.httpClient.request({
      url: this.objectUrl,
      method: 'POST',
      data: newObject
    });

    console.log('Object insert response');
    console.log(response);

    return `${issuerId}.${objectSuffix}`;
  }
}