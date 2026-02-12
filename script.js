// --- TEIL 1: MATRIX REGEN ---
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Erzeugt den Schweif-Effekt
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0'; // Matrix-Grün
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 35);

// --- TEIL 2: PROGRAMM-LOGIK ---
let result = 0;
const errorSound = new Audio('https://actions.google.com/sounds/v1/emergency/emergency_siren_short.ogg');

// Schritt 1 -> Beben -> Schritt 2
function triggerShake() {
    const input = document.getElementById('entry-input').value;
    if (input.trim() === "") {
        alert("Bitte gib eine Intention an.");
        return;
    }

    document.getElementById('main-body').classList.add('shake-active');
    
    setTimeout(() => {
        document.getElementById('main-body').classList.remove('shake-active');
        document.getElementById('step1').classList.add('hidden-step');
        document.getElementById('step2').classList.remove('hidden-step');
    }, 5000);
}

// Schritt 2: Quiz Prüfung
function checkQuiz() {
    const answer = document.getElementById('quiz-input').value.trim().toLowerCase();
    if (answer === 'remo') {
        proceedToMath();
    } else {
        showChaos();
    }
}

// Falsche Antwort: Sirene & Popups
function showChaos() {
    errorSound.play().catch(() => console.log("Audio-Autoplay blockiert"));
    const banner = document.getElementById('error-banner');
    banner.classList.remove('hidden-step');
    banner.classList.add('error-overlay');

    // 20 Popups erstellen
    for (let i = 0; i < 20; i++) {
        const popup = document.createElement('div');
        popup.className = 'fake-popup';
        popup.style.top = Math.random() * 70 + 10 + "%";
        popup.style.left = Math.random() * 70 + 10 + "%";
        popup.innerHTML = `
            <div class="popup-header"><span>Critical Error</span><span>X</span></div>
            <p style="padding:10px; font-size:12px">Access Violation: 0x000${i}</p>
        `;
        document.body.appendChild(popup);
    }

    setTimeout(() => {
        banner.classList.add('hidden-step');
        document.querySelectorAll('.fake-popup').forEach(p => p.remove());
        proceedToMath();
    }, 4000);
}

// Schritt 3: Die Mathe-Challenge (7 Sekunden!)
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
        const widthPercent = (timeLeft / 7) * 100;
        bar.style.width = widthPercent + "%";
        
        // Sofortprüfung beim Tippen
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

function win() {
    const s3 = document.getElementById('step3');
    s3.innerHTML = "<div class='text-9xl mb-4'>😉</div><h2 class='text-2xl font-bold text-green-500 uppercase'>System stabilisiert</h2>";
    setTimeout(() => {
        alert("Zutritt gewährt. Willkommen zurück.");
        location.reload();
    }, 3000);
}
