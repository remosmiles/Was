// MATRIX
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

// LOGIK
let result = 0;
const errorSound = new Audio('https://actions.google.com/sounds/v1/emergency/emergency_siren_short.ogg');

function triggerShake() {
    if (document.getElementById('entry-input').value.trim() === "") return;
    document.getElementById('main-body').classList.add('shake-active');
    setTimeout(() => {
        document.getElementById('main-body').classList.remove('shake-active');
        document.getElementById('step1').classList.add('hidden-step');
        document.getElementById('step2').classList.remove('hidden-step');
    }, 5000);
}

function checkQuiz() {
    if (document.getElementById('quiz-input').value.trim().toLowerCase() === 'remo') proceedToMath();
    else showChaos();
}

function showChaos() {
    errorSound.play().catch(() => {});
    const banner = document.getElementById('error-banner');
    banner.classList.remove('hidden-step');
    banner.classList.add('error-overlay');
    for (let i = 0; i < 15; i++) {
        const popup = document.createElement('div');
        popup.className = 'fake-popup';
        popup.style.top = Math.random() * 80 + "%";
        popup.style.left = Math.random() * 80 + "%";
        popup.innerHTML = `<div class="popup-header">Critical Error</div><p class="p-2 text-xs">Access Denied!</p>`;
        document.body.appendChild(popup);
    }
    setTimeout(() => {
        banner.classList.add('hidden-step');
        document.querySelectorAll('.fake-popup').forEach(p => p.remove());
        proceedToMath();
    }, 4000);
}

function proceedToMath() {
    document.getElementById('step2').classList.add('hidden-step');
    document.getElementById('step3').classList.remove('hidden-step');
    const n1 = Math.floor(Math.random() * 50) + 10;
    const n2 = Math.floor(Math.random() * 40) + 5;
    result = n1 + n2;
    document.getElementById('math-problem').innerText = `${n1} + ${n2}`;
    let timeLeft = 7.0;
    const timer = setInterval(() => {
        timeLeft -= 0.05;
        document.getElementById('timer-bar').style.width = (timeLeft / 7) * 100 + "%";
        if (parseInt(document.getElementById('math-input').value) === result) { clearInterval(timer); win(); }
        if (timeLeft <= 0) { clearInterval(timer); window.location.href = "https://www.bullenpower-uri.ch"; }
    }, 50);
}

function win() {
    // 1. Mathe-Box ausblenden
    const mathStep = document.getElementById('step3');
    mathStep.classList.add('hidden-step');
    
    // 2. Chat-Terminal einblenden
    const chatStep = document.getElementById('step4');
    chatStep.classList.remove('hidden-step');
    
    // 3. Fokus direkt auf das Eingabefeld setzen, damit man sofort tippen kann
    document.getElementById('chat-input').focus();
    
    console.log("System-Opa wurde aktiviert."); // Zum Testen in der F12-Konsole
}

// CHAT FUNKTION
async function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const userMsg = input.value.trim();
        if (!userMsg) return;
        displayMessage(userMsg, "user");
        input.value = "";
        const loadId = "load-" + Date.now();
        displayMessage("...", "bot", loadId);
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
            document.getElementById(loadId).remove();
            displayMessage("Verbindung abgebrochen.", "bot");
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
