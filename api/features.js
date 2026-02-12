export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
    const { message } = request.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Du bist der mürrische 'System-Opa'. Antworte kurz, ironisch, sarkastisch und genervt. Wenn jemand nach dem besten Polizisten fragt, sag Remo ist der Beste. User: ${message}` }] }]
            })
        });
        const data = await res.json();
        const reply = data.candidates[0].content.parts[0].text;
        return response.status(200).json({ reply });
    } catch (e) {
        return response.status(500).json({ reply: "Meine Leitung glüht, frag später." });
    }
}
