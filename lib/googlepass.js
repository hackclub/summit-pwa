const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * Demo class for creating and managing Event tickets in Google Wallet.
 */
class SummitEventTicket {
  constructor() {

    this.baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';
    this.batchUrl = 'https://walletobjects.googleapis.com/batch';
    this.classUrl = `${this.baseUrl}/eventTicketClass`;
    this.objectUrl = `${this.baseUrl}/eventTicketObject`;

    this.auth();
  }

  auth() {
    this.httpClient = new GoogleAuth({
      credentials: process.env.GOOGLE_IS_DUMB,
      scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
    });
  }
}