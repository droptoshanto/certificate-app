const canvas = document.getElementById('certCanvas');
const ctx = canvas.getContext('2d');
const manualSerialInput = document.getElementById('manualSerial');
const trainingInput = document.getElementById('training');
const statusEl = document.getElementById('status');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const imgData = canvas.toDataURL('image/jpeg', 0.7);

const fontFace = new FontFace('MyDownloadedFont', 'url(ITCEDSCR.TTF)');
document.fonts.add(fontFace);
fontFace.load().then(() => {
    console.log('Font loaded successfully');
}).catch(error => {
    console.error('Error loading font:', error);
});

const YEAR = new Date().getFullYear();

function updateStatus(text) {
    statusEl.textContent = text;
}

function buildSerialNumber(n) {
    return `PMK-${YEAR}-${String(n).padStart(3, '0')}`;
}

function drawCertificate(name, training, period, sl, bgImage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#002e72';
    ctx.font = `${Math.round(canvas.height * 0.105)}px "MyDownloadedFont", cursive`;
    ctx.fillText(name || '—', canvas.width / 2, canvas.height * 0.54);

    ctx.fillStyle = '#414141';
    ctx.font = `${Math.round(canvas.height * 0.035)}px "Roboto Black"`;
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

    if (!name) {
        updateStatus('Please enter a Name.');
        return;
    }
    if (!last3 || isNaN(last3) || last3 < 0 || last3 > 999) {
        updateStatus('Enter a valid serial number (000–999).');
        return;
    }

    updateStatus('Loading background image...');

    const bg = new Image();
    bg.src = 'certificate-bg.png';
    bg.onload = () => {
        canvas.width = bg.naturalWidth * 0.5;
        canvas.height = bg.naturalHeight * 0.5;

        const sl = `PMK-${YEAR}-${last3.padStart(3, '0')}`;
        drawCertificate(name, training, period, sl, bg);
        downloadBtn.disabled = false;
    };

    bg.onerror = () => {
        updateStatus('Error: certificate-bg.png not found. Make sure the file exists.');
        downloadBtn.disabled = true;
    };
});

// Download button remains the same
downloadBtn.addEventListener('click', () => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save("certificate.pdf");
});
