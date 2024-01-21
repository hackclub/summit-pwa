export default async function handler (req, res) {
    const { email } = req.body;

    const registered = true;
    if (!registered) return res.json({ registered: false });
}