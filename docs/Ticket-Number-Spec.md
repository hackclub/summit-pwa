# Ticket Numbers

The primary identifier behind tickets for The Summit are ticket numbers. These ticket numbers are 13-digit numbers generated based on the following format:

```
12 - Hash of the attendee's name
   34 - Hash of the attendee's email
      56789012 - 8 random & unique digits
               3 - Checksum digit
```