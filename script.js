// script.js — robust version with preloading and localStorage serial

const canvas = document.getElementById('certCanvas');
const ctx = canvas.getContext('2d');
const manualSerialInput = document.getElementById('manualSerial');
const trainingInput = document.getElementById('training');
const statusEl = document.getElementById('status');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const fontFace = new FontFace('MyDownloadedFont', 'url(ITCEDSCR.TTF)');

document.fonts.add(fontFace);
fontFace.load().then(() => {
    console.log('Font loaded successfully');
    document.fontFamily = 'MyDownloadedFont, sans-serif';
}).catch(error => {
    console.error('Error loading font:', error);
});
const bg = new Image();
bg.src = 'certificate-bg.png';

let imageLoaded = false;

const YEAR = new Date().getFullYear();
const STORAGE_KEY = 'pmk_serial_' + YEAR;
let stored = localStorage.getItem(STORAGE_KEY);
let serial = stored ? parseInt(stored, 10) : 1;

function updateStatus(text) {
    statusEl.textContent = text;
}

bg.onload = () => {
    imageLoaded = true;
    canvas.width = 800;
    canvas.height = 500;


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    updateStatus('Background loaded. Ready.');
    generateBtn.disabled = false;
    downloadBtn.disabled = false;
};

bg.onerror = () => {
    updateStatus('Error: certificate-bg.png not found or failed to load. Make sure the file exists in the same folder and is named exactly "certificate-bg.png".');
    generateBtn.disabled = true;
    downloadBtn.disabled = true;
};


function buildSerialNumber(n) {
    return `PMK-${YEAR}-${String(n).padStart(3, '0')}`;
}

function drawCertificate(name, training, period, sl) {
    if (!imageLoaded) {
        updateStatus('Background is still loading; please wait a second and click Generate again.');
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';

    ctx.fillStyle = '#002e72';
    ctx.font = `${Math.round(canvas.height * 0.105)}px  "MyDownloadedFont", cursive`;
    ctx.fillText(name || '—', canvas.width / 2, canvas.height * 0.54);

    ctx.fillStyle = '#414141';
    ctx.font = `${Math.round(canvas.height * 0.035)}px "Roboto Black" ,sans-serif`;
    ctx.fillText(training || '—', canvas.width / 2, canvas.height * 0.685);

    ctx.fillStyle = '#414141';
    ctx.font = `${Math.round(canvas.height * 0.020)}px "Roboto Regular", Arial`;
    ctx.fillText(period || '—', canvas.width / 2, canvas.height * 0.72);

    ctx.textAlign = 'right';
    ctx.font = `${Math.round(canvas.height * 0.018)}px Arial`;
    ctx.fillStyle = '#414141';
    ctx.fillText('SL: ' + sl, canvas.width * 0.94, canvas.height * 0.12);

    updateStatus('Certificate generated. You can download it now.');
}

generateBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const training = document.getElementById('training').value.trim();
    const period = document.getElementById('period').value.trim();
    const last3 = manualSerialInput.value.trim();

    if (!imageLoaded) {
        updateStatus('Background still loading. Wait a moment.');
        return;
    }
    if (!name) {
        updateStatus('Please enter a Name.');
        return;
    }
    if (!last3 || isNaN(last3) || last3 < 0 || last3 > 999) {
        updateStatus('Enter a valid serial number (000–999).');
        return;
    }

    const YEAR = new Date().getFullYear();
    const sl = `PMK-${YEAR}-${last3.padStart(3, '0')}`;

    drawCertificate(name, training, period, sl);
});

downloadBtn.addEventListener('click', () => {
    if (!imageLoaded) return;

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jspdf.jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save("certificate.pdf");
});
