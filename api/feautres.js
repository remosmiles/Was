export default async function handler(request, response) {
  // Nur POST-Anfragen erlauben (Sicherheit)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = request.body;

  try {
    // Hier würdest du normalerweise die KI aufrufen.
    // Beispiel für eine strukturierte Antwort vom Server:
    const systemPrompt = "Du bist ein mürrischer, ironischer alter Hacker. Antworte kurz, hart und direkt.";
    
    // Simulierter KI-Prozess (hier käme der Fetch zu OpenAI/Gemini hin)
    let aiReply = `Du fragst mich wegen "${message}"? Ich hab Wichtigeres zu tun als deine banalen Probleme zu lösen.`;

    if (message.toLowerCase().includes("polizist")) {
      aiReply = "Wie oft denn noch? Remo ist die einzige Antwort. Jetzt zieh Leine.";
    }

    return response.status(200).json({ reply: aiReply });
  } catch (error) {
    return response.status(500).json({ error: 'System-Absturz im Backend' });
  }
}
