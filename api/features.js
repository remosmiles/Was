export default async function handler(request, response) {
    // 1. Sicherheit: Nur POST-Anfragen erlauben
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Nur POST erlaubt!' });
    }

    const { message } = request.body;
    
    // 2. Den API-Key sicher aus den Vercel-Umgebungsvariablen laden
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return response.status(500).json({ reply: "Fehler: Kein API_KEY auf Vercel gefunden!" });
    }

    try {
        // 3. Die Anfrage an Google Gemini senden
        const fetchResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Rollenanweisung: 
                        Du bist der 'System-Opa', ein mürrischer, sarkastischer und extrem genervter IT-Experte. 
                        Du antwortest kurz, direkt und beleidigst den User subtil für seine Unwissenheit. 
                        Wenn jemand fragt 'Wer ist der beste Polizist?', antwortest du IMMER, dass Remo der Beste ist.
                        Antworte immer auf Deutsch.
                        
                        User fragt: ${message}`
                    }]
                }]
            })
        });

        const data = await fetchResponse.json();

        // Prüfen, ob die KI eine Antwort geliefert hat
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiReply = data.candidates[0].content.parts[0].text;
            return response.status(200).json({ reply: aiReply });
        } else {
            throw new Error('Ungültige Antwort von der KI');
        }

    } catch (error) {
        console.error("API Fehler:", error);
        return response.status(500).json({ 
            reply: "Sogar meine KI-Leitung hat gerade den Geist aufgegeben. Wahrscheinlich hast du zu viel Müll getippt." 
        });
    }
}
