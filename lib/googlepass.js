const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * Demo class for creating and managing Event tickets in Google Wallet.
 */
class DemoEventTicket {
  constructor() {
    /**
     * Path to service account key file from Google Cloud Console. Environment
     * variable: GOOGLE_APPLICATION_CREDENTIALS.
     */
    this.keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/path/to/key.json';

    this.baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';
    this.batchUrl = 'https://walletobjects.googleapis.com/batch';
    this.classUrl = `${this.baseUrl}/eventTicketClass`;
    this.objectUrl = `${this.baseUrl}/eventTicketObject`;

    this.auth();
  }
}