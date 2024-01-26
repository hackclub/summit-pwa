import { updateAttendeeById } from "@/lib/airtable";
import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";

export default async function confirm (req, res) {
    const sessionId = getCookie("session", { req, res });

    const user = await currentUser(sessionId);

    let updated = false;
    if (!user.fields.ticketing_attendanceConfirmed) {
        try {
            await updateAttendeeById(user.id, {
                ticketing_attendanceConfirmed: true
            });
            updated = true;
        } catch (err) {
            console.error(err);
        }
    }


    res.json({ updated });
}