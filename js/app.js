const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const uiLayer = document.getElementById('ui-layer');
const yesBtn = document.getElementById('btn-yes');
const noBtn = document.getElementById('btn-no');

let gameState = 'playing'; // 'playing', 'yes', 'no'
let stuckItems = [];

// Event Listeners
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        gameState = 'yes';
        uiLayer.style.display = 'none';
    });
}

if (noBtn) {
    noBtn.addEventListener('click', () => {
        gameState = 'no';
        uiLayer.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';

// Assets
const cowImg = new Image();
cowImg.src = 'assets/cow.svg';
const heartImg = new Image();
heartImg.src = 'assets/heart.svg';

let isModelLoaded = false;

async function loadModels() {
    console.log("Loading models...");
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        isModelLoaded = true;
        console.log("Models loaded");
        startVideo();
    } catch (err) {
        console.error("Error loading models:", err);
    }
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error("Error starting video:", err));
}

video.addEventListener('play', () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    // Adjust canvas to match video dimensions
    // We might need to handle resize events in a real app, but for now specific start is okay

    // Periodically check size until it's ready
    const checkSize = setInterval(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
            clearInterval(checkSize);
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            faceapi.matchDimensions(canvas, { width: video.videoWidth, height: video.videoHeight });

            // Start the loop
            loop();
        }
    }, 100);
});

// Particle System
let particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10; // Random size
        this.speedX = Math.random() * 2 - 1; // Random horizontal
        this.speedY = Math.random() * -3 - 1; // Always up
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01; // Fade out
    }

    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(heartImg, this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

async function loop() {
    if (!isModelLoaded) return;
    if (gameState === 'no') return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare context for mirroring
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);

    if (gameState === 'yes') {
        // Spawn new stuck items
        const count = 5; // Add 5 per frame
        for(let i=0; i<count; i++) {
            stuckItems.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                img: Math.random() > 0.5 ? cowImg : heartImg,
                size: Math.random() * 50 + 30,
                rotation: Math.random() * Math.PI * 2
            });
        }

        // Draw all stuck items
        for(let item of stuckItems) {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            if (item.img.complete) {
                ctx.drawImage(item.img, -item.size/2, -item.size/2, item.size, item.size);
            }
            ctx.restore();
        }
    } else {
        // Detect face
        const rawDetections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

        // Resize detections to match canvas size
        const detections = rawDetections ? faceapi.resizeResults(rawDetections, { width: canvas.width, height: canvas.height }) : null;

        if (detections) {
            const landmarks = detections.landmarks;
            const nose = landmarks.getNose()[3]; // Tip of the nose

            // Face width for scaling
            const jawOutline = landmarks.getJawOutline();
            const faceWidth = Math.abs(jawOutline[0].x - jawOutline[16].x);

            const size = faceWidth * 1.5; // Cow size relative to face

            // Draw Cow (centered on nose)
            if (cowImg.complete) {
                ctx.drawImage(cowImg, nose.x - size/2, nose.y - size/2, size, size);
            }

            // Emit particles
            if (Math.random() < 0.3) { // 30% chance per frame
                particles.push(new Particle(nose.x, nose.y));
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    ctx.restore();

    requestAnimationFrame(loop);
}

// Init
loadModels();
