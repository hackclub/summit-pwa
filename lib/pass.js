import { Template } from "@walletpass/pass-js";
import fs from "fs/promises";
import { applyKeys } from "./keys.js";
import { exec } from "child_process";
import { resizeImage } from "./image.js";

const assetsPath = process.env.NODE_ENV == "development" ? "http://localhost:" + process.env.PORT + "/assets/apple-wallet-pass" : "https://summit-ticketing.hackclub.dev/assets/apple-wallet-pass";

const hackathon = {
    name: "The Summit",
    website: "https://summit.hackclub.com",
    location: "San Francisco"
}

const style = {
    imageIsDecorative: false
}

const attendee = {
    qrCodeUrl: "https://st.hack.af/",
    fullName: "Fiona Hackworth",
    waiverSigned: true
}

async function addAsset (template, name, bufferOrPath, smallestScale) {
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

export async function generatePass () {
    const template = new Template("eventTicket", {
        passTypeIdentifier: "pass.zip.hackathon.development",
        teamIdentifier: "P6PV2R9443",
        organizationName: "The Summit",
        sharingProhibited: true,
        barcodes: [
            {
                message: "HELLO",
                format: "PKBarcodeFormatQR",
                messageEncoding: "iso-8859-1"
            }
        ],
        appLaunchURL: "https://summit.hackclub.com",
    });

    const [icon, strip, logo] = await Promise.allSettled([
        "/hackclub.png",
        "/banner.png",
        "/summit.png"
    ].map(fileName => {
        return (async () => {
            const url = assetsPath + fileName;
            const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());

            return Buffer.from(arrayBuffer);
        })();
    }));

    await template.images.add("icon", icon.value);
    await template.images.add("strip", strip.value, "3x");

    await addAsset(template, "logo", logo.value, 160);


    applyKeys(template);

    const pass = template.createPass({
        serialNumber: "123456",
        description: "Pass",
        foregroundColor: "rgb(255, 236, 150)",
        backgroundColor: "rgb(180, 46, 30)",
        labelColor: "rgb(255, 236, 150)",
        logoText: hackathon.name
    });

    pass.headerFields.add({
        key: "date",
        value: new Date("2-9-2024"),
        dateStyle: "PKDateStyleMedium",
        label: "Date"
    });

    if (style.imageIsDecorative) {
        pass.primaryFields.add({
            key: "name",
            value: attendee.fullName,
            label: "Attendee"
        });
    } else {
        pass.secondaryFields.add({
            key: "name",
            value: attendee.fullName,
            label: "Attendee"
        });
    }

    pass.secondaryFields.add({
        key: "location",
        value: hackathon.location,
        label: "Location"
    });

    if (attendee.waiverSigned) {
        pass.auxiliaryFields.add({
            key: "waiver",
            value: "Signed",
            label: "Waiver"
        });
    }

    pass.backFields.add({
        key: "website",
        value: hackathon.website,
        label: "Website",
        attributedValue: `<a href="${hackathon.website}">Summit Website</a>`,
    });

    const buf = await pass.asBuffer();

    return buf;
}