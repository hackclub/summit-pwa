import { Template } from "@walletpass/pass-js";
import fs from "fs/promises";
import { applyKeys } from "./keys.js";
import { resizeImage } from "./image.js";

const assetsPath =
  process.env.NODE_ENV == "development"
    ? "http://localhost:" + process.env.PORT + "/assets/apple-wallet-pass"
    : "https://summit-ticketing.hackclub.dev/assets/apple-wallet-pass";

async function addAsset(template, name, bufferOrPath, smallestScale) {
  let buffer = bufferOrPath;

  if (typeof bufferOrPath === "string") {
    buffer = await fs.readFile(bufferOrPath);
  }

  const x1 = await resizeImage(buffer, smallestScale, smallestScale);
  const x2 = await resizeImage(buffer, smallestScale * 2, smallestScale * 2);
  const x3 = await resizeImage(buffer, smallestScale * 3, smallestScale * 3);

  await template.images.add(name, x1, "1x");
  await template.images.add(name, x2, "2x");
  await template.images.add(name, x3, "3x");
}

export async function generatePass({ user }) {
  const template = new Template("eventTicket", {
      passTypeIdentifier: "pass.zip.hackathon.development",
      teamIdentifier: "P6PV2R9443",
      organizationName: "The Summit",
      sharingProhibited: true,
      barcodes: [
        {
          message: `https://st.hack.af/${user.fields.ticketing_ticketNumber}`,
          format: "PKBarcodeFormatQR",
          messageEncoding: "iso-8859-1"
        }
      ],
      serialNumber: user.fields.ticketing_ticketNumber,
      appLaunchURL: "https://summit.hackclub.com",
      locations: [
        {
          latitude: 37.75888471463502,
          longitude: -122.4255812955357
        }
      ],
      relevantDate: new Date('February 9, 2024 18:00:00 GMT-0800'),
    
  });

  const [icon, strip, logo] = await Promise.allSettled(
    ["/hackclub.png", "/banner.png", "/summit.png"].map((fileName) => {
      return (async () => {
        const url = assetsPath + fileName;
        const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());

        return Buffer.from(arrayBuffer);
      })();
    })
  );

  await template.images.add("icon", icon.value);
  await template.images.add("strip", strip.value, "3x");

  await addAsset(template, "logo", logo.value, 160);

  console.log(template)
  applyKeys(template);

  const pass = template.createPass({
    serialNumber: "123456",
    description: "Pass",
    foregroundColor: "rgb(255, 236, 150)",
    backgroundColor: "rgb(180, 46, 30)",
    labelColor: "rgb(255, 236, 150)",
    logoText: "The Summit",
  });

  pass.headerFields.add({
    key: "date",
    value: new Date("2-9-2024"),
    dateStyle: "PKDateStyleMedium",
    //"dataDetectorTypes": "PKDataDetectorTypeCalendarEvent",
    label: "Date"
  });

  pass.secondaryFields.add({
    key: "name",
    value: `${user.fields.first_name} ${user.fields.last_name}`,
    label: "Attendee"
  });

  pass.secondaryFields.add({
    key: "location",
    value: "The Light House, SF",
    "attributedValue": "http://maps.apple.com/?address=651+Dolores+St,+San Francisco,+CA+94110",
    label: "Location"
  });

  pass.relevantDate = new Date("2-9-2024");

  /*
  pass.auxiliaryFields.add({
    key: "waiver",
    value: user.fields.ticketing_waiverStatus.split("").map((c, i) => i == 0 ? c.toUpperCase() : c).join(""),
    label: "Waiver"
  });

  pass.auxiliaryFields.add();


  */

  const buf = await pass.asBuffer();

  return buf;
}
