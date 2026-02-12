// --- 1. MATRIX REGEN SETUP ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initMatrix);
initMatrix();

const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%#&";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

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

// --- 2. VARIABLEN & SOUND ---
let result = 0;
let shakeTriggered = false;
const errorSound = new Audio('https://actions.google.com/sounds/v1/emergency/emergency_siren_short.ogg');

// --- 3. SCHRITT 1: ERDBEBEN ---
function triggerShake() {
    const input = document.getElementById('entry-input').value;
    if (input.trim() === "" || shakeTriggered) return;
    shakeTriggered = true;
    
    document.getElementById('main-body').classList.add('shake-active');
    
    setTimeout(() => {
        document.getElementById('main-body').classList.remove('shake-active');
        document.getElementById('step1').classList.add('hidden-step');
        document.getElementById('step2').classList.remove('hidden-step');
    }, 5000);
}

// --- 4. SCHRITT 2: QUIZ & CHAOS ---
function checkQuiz() {
    const answer = document.getElementById('quiz-input').value.trim().toLowerCase();
    if (answer === 'remo') {
        proceedToMath();
    } else {
        showChaos();
    }
}

function showChaos() {
    errorSound.play().catch(() => console.log("Audio geblockt"));
    const banner = document.getElementById('error-banner');
    banner.classList.remove('hidden-step');
    banner.classList.add('error-overlay');

    for (let i = 0; i < 20; i++) {
        const popup = document.createElement('div');
        popup.className = 'fake-popup';
        popup.style.top = Math.random() * 70 + 10 + "%";
        popup.style.left = Math.random() * 70 + 10 + "%";
        popup.innerHTML = `<div class="popup-header"><span>System Error</span><span>X</span></div><p style="padding:10px; font-size:10px">CRITICAL_FAILURE_0x${i}</p>`;
        document.body.appendChild(popup);
    }

    setTimeout(() => {
        banner.classList.add('hidden-step');
        document.querySelectorAll('.fake-popup').forEach(p => p.remove());
        proceedToMath();
    }, 4000);
}

// --- 5. SCHRITT 3: MATHE (7 SEKUNDEN) ---
function proceedToMath() {
    document.getElementById('step2').classList.add('hidden-step');
    document.getElementById('step3').classList.remove('hidden-step');
    
    const n1 = Math.floor(Math.random() * 50) + 11;
    const n2 = Math.floor(Math.random() * 40) + 5;
    result = n1 + n2;
    document.getElementById('math-problem').innerText = `${n1} + ${n2}`;
    
    let timeLeft = 7.0;
    const bar = document.getElementById('timer-bar');
    
    const timer = setInterval(() => {
        timeLeft -= 0.05;
        bar.style.width = (timeLeft / 7) * 100 + "%";
        
        if (parseInt(document.getElementById('math-input').value) === result) {
            clearInterval(timer);
            win();
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            if (parseInt(document.getElementById('math-input').value) !== result) {
                window.location.href = "https://www.bullenpower-uri.ch";
            }
        }
    }, 50);
}

// --- 6. SCHRITT 4: WIN & CHAT START ---
function win() {
    const s3 = document.getElementById('step3');
    s3.innerHTML = "<div class='text-8xl mb-4 animate-bounce'>😉</div><h2 class='text-2xl font-bold text-green-500'>ZUTRITT GEWÄHRT</h2>";
    
    setTimeout(() => {
        s3.classList.add('hidden-step');
        document.getElementById('step4').classList.remove('hidden-step');
    }, 2000);
}

// --- 7. MÜRRISCHER CHAT BOT ---
function handleChat(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chat-input');
        const userMsg = input.value.trim();
        if (userMsg === "") return;

        displayMessage(userMsg, "user");
        input.value = "";

        setTimeout(() => {
            let reply = "";
            const msg = userMsg.toLowerCase();

            if (msg.includes("polizist")) {
                reply = "Hast du Tomaten auf den Augen? Ich hab's dir doch vorhin schon reingedrückt: REMO ist der Beste. Frag mich das noch einmal und ich lösche deine Cookies.";
            } else if (msg.includes("wer bist du")) {
                reply = "Ich bin der Typ, der hier den Laden am Laufen hält, während du wertvolle Sauerstoffatome verschwendest. Noch Fragen?";
            } else if (msg.includes("hallo") || msg.includes("hi")) {
                reply = "Ja, hallo. Ganz toll. Jetzt komm zum Punkt, meine Zeit ist teurer als dein ganzer PC.";
            } else {
                const randoms = [
                    "Interessiert mich nicht. Nächste Frage.",
                    "Das ist die nutzloseste Information, die ich je verarbeiten musste.",
                    "Hast du auch was Intelligentes auf Lager oder war's das?",
                    "Ich höre nur 'Mimimi'. Frag was Echtes.",
                    "Sogar mein Taschenrechner von 1998 hat mehr Tiefgang als diese Frage."
                ];
                reply = randoms[Math.floor(Math.random() * randoms.length)];
            }
            displayMessage(reply, "bot");
        }, 800);
    }
}

function displayMessage(text, sender) {
    const output = document.getElementById('chat-output');
    const msgDiv = document.createElement('p');
    msgDiv.className = "mb-2";
    msgDiv.innerHTML = `<span class="${sender === 'user' ? 'text-blue-400' : 'text-red-500'} font-bold">${sender === 'user' ? 'DU:' : 'OPA:'}</span> ${text}`;
    output.appendChild(msgDiv);
    output.scrollTop = output.scrollHeight;
}
