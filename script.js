async function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const userMsg = input.value.trim();
        if (userMsg === "") return;

        // 1. Deine Nachricht im Fenster anzeigen
        displayMessage(userMsg, "user");
        input.value = "";

        // 2. Kurz warten (sieht echter aus)
        const loadingId = "loading-" + Date.now();
        displayMessage("...", "bot", loadingId);

        try {
            // 3. Hier passiert die Magie: Der Aufruf an dein Backend
            const response = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();
            
            // 4. Antwort vom Server (Opa) anzeigen
            document.getElementById(loadingId).remove();
            displayMessage(data.reply, "bot");

        } catch (error) {
            document.getElementById(loadingId).remove();
            displayMessage("Verbindung verloren. Hast du das WLAN-Kabel gefressen?", "bot");
        }
    }
}

// Hilfsfunktion zum Anzeigen der Nachrichten
function displayMessage(text, sender, id = null) {
    const output = document.getElementById('chat-output');
    const msgDiv = document.createElement('p');
    if (id) msgDiv.id = id;
    msgDiv.innerHTML = `<span class="${sender === 'user' ? 'text-blue-400' : 'text-red-500'} font-bold">${sender === 'user' ? 'DU:' : 'OPA:'}</span> ${text}`;
    output.appendChild(msgDiv);
    output.scrollTop = output.scrollHeight; // Immer nach unten scrollen
}
