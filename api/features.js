export default async function handler(request, response) {
    // Sicherheit: Nur POST-Anfragen erlauben
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Nur POST erlaubt, du Amateur!' });
    }

    const { message } = request.body;

    // Falls keine Nachricht ankommt
    if (!message) {
        return response.status(400).json({ reply: "Hast du das Tippen verlernt? Sag schon was." });
    }

    const lowerMsg = message.toLowerCase();
    let reply = "";

    // Mürrische Logik-Zentrale
    if (lowerMsg.includes("polizist")) {
        reply = "Wie oft denn noch? REMO ist der einzig wahre Polizist hier. Fragst du das nur, um mich zu nerven? Geh und spiel mit deinen Bauklötzen.";
    } 
    else if (lowerMsg.includes("hallo") || lowerMsg.includes("hi")) {
        reply = "Ein 'Hallo' gibt dir auch keinen Admin-Zugriff. Was willst du von mir?";
    }
    else if (lowerMsg.includes("wetter")) {
        reply = "Zieh ein Fenster auf und schau raus. Ich bin eine KI, keine Wetterstation.";
    }
    else {
        // Zufällige mürrische Antworten für alles andere
        const omasSprüche = [
            `"${message}"? Ernsthaft? Das ist die belangloseste Frage des Jahrhunderts.`,
            "Ich hab 1000 Terabyte Daten im Kopf und du fragst mich SOWAS?",
            "Mein Lüfter fängt an zu pfeifen, nur weil ich über deinen Unsinn nachdenken muss.",
            "Die Antwort lautet: Frag mich nicht. Such dir ein Hobby.",
            "Ironisch, dass du denkst, ich würde dir darauf eine nette Antwort geben."
        ];
        reply = omasSprüche[Math.floor(Math.random() * omasSprüche.length)];
    }

    // Antwort zurück an dein script.js schicken
    return response.status(200).json({ reply: reply });
}
