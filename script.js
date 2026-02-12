async function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const userMsg = input.value.trim();
        if (userMsg === "") return;

        displayMessage(userMsg, "user");
        input.value = "";

        // Anfrage an deine features.js senden
        try {
            const res = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            displayMessage(data.reply, "bot");
        } catch (err) {
            displayMessage("Verbindung abgebrochen. Wahrscheinlich hast du das Internet kaputt gemacht.", "bot");
        }
    }
}
