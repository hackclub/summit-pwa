import { updateAttendeeById } from "@/lib/airtable";
import Session from "@/lib/sessions";
import { getCookie } from "cookies-next";

export default async function confirm (req, res) {
    const sessionId = getCookie("session", { req, res });

    const user = await Session.currentUser(sessionId);

    const { dietaryRestrictions, email, age, waiverType } = req.body;

    let updated = false;
    if (!user.fields.ticketing_age) {
        try {
            await updateAttendeeById(user.id, {
                ticketing_dietaryRestrictions: dietaryRestrictions,
                ticketing_parentEmail: email,
                ticketing_age: age,
                ticketing_waiverType: waiverType,
            });
            updated = true;
        } catch (err) {
            console.error(err);
        }
    }


    res.json({ updated });
}