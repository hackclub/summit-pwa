const crypto = require('crypto');
function checksum (number) {
    const digits = (number + '').split('');
 
    return digits.reduce((amount, digit) => +digit + +amount) % 10;
 }
 
 async function hash (message, salt = "", length = 2) {
    const encodedMessage = new TextEncoder().encode(salt + message);
 
    const buffer = await crypto.subtle.digest('SHA-256', encodedMessage);
 
    const hex = Array.from(new Uint8Array(buffer)).map(b => {
       return b.toString(16).padStart(2, '0');
    }).slice(0, 4).join('');
 
    return ((parseInt(hex, 16) % (10 ** length)) + '').padStart(length, '0');
 }
 
 function randomDigits (length) {
    let digits = "";
 
    for (foo of new Array(length)) {
       digits += Math.floor(Math.random() * 10);
    }
 
    return digits;;
 }
 
 async function ticketNumber (name, email) {
    const hashName = await hash(name);
    const hashEmail = await hash(email);
    const random = randomDigits(8);
 
    console.log(hashName, hashEmail, random);

    let ticketNumber = hashName + hashEmail + random;
    ticketNumber += checksum(ticketNumber);
 
    return ticketNumber;
 }
 
 ticketNumber("Fiona Hackworth", "fiona@hackclub.com").then(console.log)