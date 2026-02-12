// --- MATRIX BACKGROUND ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%#&";
const fontSize = 16;
const drops = Array(Math.floor(canvas.width / fontSize)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);

// --- NAVIGATION & LOGIK ---
function triggerShake() {
    if (!document.getElementById('entry-input').value) return;
    document.getElementById('main-body').classList.add('shake-active');
    setTimeout(() => {
        document.getElementById('main-body').classList.remove('shake-active');
        document.getElementById('step1').classList.add('hidden-step');
        document.getElementById('step2').classList.remove('hidden-step');
    }, 4000);
}

function checkQuiz() {
    const val = document.getElementById('quiz-input').value.trim();
    document.getElementById('step2').classList.add('hidden-step');
    
    // ZEIGE CHAT FENSTER
    const chatWindow = document.getElementById('step4');
    chatWindow.classList.remove('hidden-step');
    
    // Erste mürrische Reaktion
    displayMessage(val, "user");
    setTimeout(() => {
        displayMessage(`"${val}"? Ernsthaft? Das ist die falscheste Antwort, die ich je in diesem System gesehen habe. Du hast keine Ahnung! Erklär dich oder verschwinde!`, "bot");
    }, 500);
}

// --- KI CHAT FUNKTION (GEMINI) ---
async function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const userMsg = input.value.trim();
        if (!userMsg) return;

        displayMessage(userMsg, "user");
        input.value = "";

        const loadId = "id-" + Date.now();
        displayMessage("Opa tippt wütend...", "bot", loadId);

        try {
            const res = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();
            document.getElementById(loadId).remove();
            displayMessage(data.reply, "bot");
        } catch (e) {
            document.getElementById(loadId).innerText = "OPA: Leitung tot. Glück für dich.";
        }
    }
}

function displayMessage(text, sender, id = null) {
    const output = document.getElementById('chat-output');
    const p = document.createElement('p');
    if (id) p.id = id;
    p.innerHTML = `<span class="${sender === 'user' ? 'text-blue-400' : 'text-red-500'} font-bold">${sender === 'user' ? 'DU:' : 'OPA:'}</span> ${text}`;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
}
