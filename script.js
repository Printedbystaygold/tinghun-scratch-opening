const invitation = document.getElementById("invitation");
const scratchCanvas = document.getElementById("scratchCanvas");
const scratchCtx = scratchCanvas.getContext("2d", {
  willReadFrequently: true
});

const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");

const instruction = document.getElementById("instruction");
const fade = document.getElementById("fade");

const DESTINATION =
  "https://printedbystaygold.com/demo-pastelbloom-chinese-elegance";

const SCRATCH_THRESHOLD = 0.75;

let isScratching = false;
let completed = false;
let lastPoint = null;
let lastCheck = 0;

let brushTexture = null;


/* --------------------------------------------------
   CANVAS SIZE
-------------------------------------------------- */

function resizeCanvases() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const width = window.innerWidth;
  const height = window.innerHeight;

  scratchCanvas.width = Math.round(width * dpr);
  scratchCanvas.height = Math.round(height * dpr);

  scratchCanvas.style.width = width + "px";
  scratchCanvas.style.height = height + "px";

  scratchCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  confettiCanvas.width = Math.round(width * dpr);
  confettiCanvas.height = Math.round(height * dpr);

  confettiCanvas.style.width = width + "px";
  confettiCanvas.style.height = height + "px";

  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createScratchCard();

}


/* --------------------------------------------------
   RED TINGHUN CARD
-------------------------------------------------- */

function createScratchCard() {

  const w = window.innerWidth;
  const h = window.innerHeight;

  scratchCtx.clearRect(0, 0, w, h);

  /*
    Deep red base
  */

  const gradient = scratchCtx.createLinearGradient(
    0,
    0,
    w,
    h
  );

  gradient.addColorStop(0, "#a81720");
  gradient.addColorStop(0.5, "#8f1018");
  gradient.addColorStop(1, "#65080e");

  scratchCtx.fillStyle = gradient;
  scratchCtx.fillRect(0, 0, w, h);


  /*
    Subtle gold texture
  */

  scratchCtx.save();

  scratchCtx.globalAlpha = 0.08;

  for (let x = -h; x < w + h; x += 24) {

    scratchCtx.beginPath();

    scratchCtx.moveTo(x, 0);
    scratchCtx.lineTo(x + h, h);

    scratchCtx.strokeStyle = "#f2d28c";
    scratchCtx.lineWidth = 1;

    scratchCtx.stroke();
  }

  scratchCtx.restore();


  /*
    Decorative border
  */

  scratchCtx.save();

  const margin = Math.min(w, h) * 0.045;

  scratchCtx.strokeStyle = "rgba(239, 201, 119, 0.9)";
  scratchCtx.lineWidth = 1.5;

  scratchCtx.strokeRect(
    margin,
    margin,
    w - margin * 2,
    h - margin * 2
  );

  scratchCtx.strokeStyle = "rgba(239, 201, 119, 0.35)";
  scratchCtx.lineWidth = 1;

  scratchCtx.strokeRect(
    margin + 7,
    margin + 7,
    w - (margin + 7) * 2,
    h - (margin + 7) * 2
  );

  scratchCtx.restore();


  /*
    Chinese double happiness symbol
  */

  scratchCtx.save();

  scratchCtx.fillStyle = "#edc779";
  scratchCtx.globalAlpha = 0.9;

  scratchCtx.font =
    "bold " + Math.min(w, h) * 0.18 + "px serif";

  scratchCtx.textAlign = "center";
  scratchCtx.textBaseline = "middle";

  scratchCtx.fillText(
    "囍",
    w / 2,
    h * 0.42
  );

  scratchCtx.restore();


  /*
    Elegant instruction area
  */

  scratchCtx.save();

  scratchCtx.textAlign = "center";

  scratchCtx.fillStyle = "#f2d59b";

  scratchCtx.font =
    "500 " + Math.max(13, Math.min(w, h) * 0.022) +
    "px Georgia";

  scratchCtx.letterSpacing = "3px";

  scratchCtx.fillText(
    "A SPECIAL INVITATION AWAITS",
    w / 2,
    h * 0.58
  );

  scratchCtx.restore();


  /*
    Gold decorative lines
  */

  drawDecorativeCorner(w * 0.18, h * 0.68, 1);
  drawDecorativeCorner(w * 0.82, h * 0.68, -1);


  /*
    Create scratch texture
  */

  createBrushTexture();
}


/* --------------------------------------------------
   DECORATIVE CORNERS
-------------------------------------------------- */

function drawDecorativeCorner(x, y, direction) {

  scratchCtx.save();

  scratchCtx.translate(x, y);
  scratchCtx.scale(direction, 1);

  scratchCtx.strokeStyle = "rgba(239, 201, 119, 0.7)";
  scratchCtx.lineWidth = 1.5;

  scratchCtx.beginPath();

  scratchCtx.moveTo(0, 0);
  scratchCtx.lineTo(55, 0);

  scratchCtx.moveTo(0, 0);
  scratchCtx.lineTo(0, 32);

  scratchCtx.moveTo(10, 8);
  scratchCtx.lineTo(43, 8);

  scratchCtx.stroke();

  scratchCtx.restore();
}


/* --------------------------------------------------
   IRREGULAR SCRATCH BRUSH
-------------------------------------------------- */

function createBrushTexture() {

  /*
    We create an elongated, organic brush.

    This is NOT a circle.

    The shape has:
    - uneven edges
    - varied density
    - long horizontal texture
    - soft transparency
  */

  const size = 130;

  brushTexture = document.createElement("canvas");

  brushTexture.width = size;
  brushTexture.height = size;

  const ctx = brushTexture.getContext("2d");

  const image = ctx.createImageData(size, size);

  const center = size / 2;

  for (let y = 0; y < size; y++) {

    for (let x = 0; x < size; x++) {

      /*
        Organic elliptical distance
      */

      const nx = (x - center) / 58;
      const ny = (y - center) / 26;

      const distance =
        Math.sqrt(nx * nx + ny * ny);

      /*
        Irregular noise
      */

      const wave =
        Math.sin(x * 0.31) *
        Math.sin(y * 0.17) *
        0.15;

      const edge =
        distance + wave;

      let alpha = 0;

      if (edge < 1) {

        alpha =
          (1 - edge) *
          255;

        /*
          Fine paper-like variation
        */

        alpha *=
          0.72 +
          Math.random() * 0.28;
      }

      const index =
        (y * size + x) * 4;

      image.data[index] = 255;
      image.data[index + 1] = 255;
      image.data[index + 2] = 255;
      image.data[index + 3] = alpha;
    }
  }

  ctx.putImageData(image, 0, 0);
}


/* --------------------------------------------------
   SCRATCH POINT
-------------------------------------------------- */

function getPoint(event) {

  const rect =
    scratchCanvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}


/* --------------------------------------------------
   SMOOTH SCRATCH
-------------------------------------------------- */

function scratchTo(point) {

  if (!lastPoint) {

    lastPoint = point;

    return;
  }

  const dx =
    point.x - lastPoint.x;

  const dy =
    point.y - lastPoint.y;

  const distance =
    Math.sqrt(dx * dx + dy * dy);

  if (distance < 1) return;


  /*
    Angle follows the user's movement.

    This makes the scratch look like rubbing,
    rather than stamping.
  */

  const angle =
    Math.atan2(dy, dx);


  /*
    Interpolate between previous point
    and current point.

    This prevents gaps when the finger
    moves quickly.
  */

  const steps =
    Math.ceil(distance / 5);

  for (let i = 1; i <= steps; i++) {

    const t = i / steps;

    const x =
      lastPoint.x + dx * t;

    const y =
      lastPoint.y + dy * t;

    stampBrush(x, y, angle);
  }

  lastPoint = point;


  /*
    Check progress periodically.
  */

  const now = performance.now();

  if (now - lastCheck > 350) {

    lastCheck = now;

    checkProgress();
  }
}


/* --------------------------------------------------
   BRUSH STAMP
-------------------------------------------------- */

function stampBrush(x, y, angle) {

  if (!brushTexture) return;

  scratchCtx.save();

  scratchCtx.globalCompositeOperation =
    "destination-out";

  scratchCtx.translate(x, y);

  scratchCtx.rotate(angle);


  /*
    Slight random variation.

    This keeps the scratch organic
    without creating visible circles.
  */

  const scaleX =
    0.82 + Math.random() * 0.25;

  const scaleY =
    0.82 + Math.random() * 0.18;

  scratchCtx.scale(
    scaleX,
    scaleY
  );


  /*
    Draw elongated textured brush.
  */

  scratchCtx.globalAlpha = 0.92;

  scratchCtx.drawImage(
    brushTexture,
    -65,
    -65,
    130,
    130
  );

  scratchCtx.restore();
}


/* --------------------------------------------------
   POINTER EVENTS
-------------------------------------------------- */

scratchCanvas.addEventListener(
  "pointerdown",
  event => {

    if (completed) return;

    event.preventDefault();

    isScratching = true;

    scratchCanvas.setPointerCapture(
      event.pointerId
    );

    lastPoint = getPoint(event);

    instruction.classList.add("hidden");

    /*
      Start with a short organic stroke
      rather than a circular dot.
    */

    const p = lastPoint;

    stampBrush(
      p.x,
      p.y,
      Math.random() * Math.PI
    );

  },
  { passive: false }
);


scratchCanvas.addEventListener(
  "pointermove",
  event => {

    if (!isScratching || completed) return;

    event.preventDefault();

    scratchTo(getPoint(event));

  },
  { passive: false }
);


function stopScratching(event) {

  isScratching = false;
  lastPoint = null;

  if (
    event &&
    scratchCanvas.hasPointerCapture(event.pointerId)
  ) {

    scratchCanvas.releasePointerCapture(
      event.pointerId
    );
  }

  checkProgress();
}


scratchCanvas.addEventListener(
  "pointerup",
  stopScratching
);

scratchCanvas.addEventListener(
  "pointercancel",
  stopScratching
);

scratchCanvas.addEventListener(
  "pointerleave",
  event => {

    if (isScratching) {
      stopScratching(event);
    }

  }
);


/* --------------------------------------------------
   SCRATCH PROGRESS
-------------------------------------------------- */

function checkProgress() {

  if (completed) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  /*
    Downsample the canvas.

    This makes progress checking much faster
    on mobile devices.
  */

  const sampleSize = 80;

  const temp =
    document.createElement("canvas");

  temp.width = sampleSize;
  temp.height = sampleSize;

  const tempCtx =
    temp.getContext("2d", {
      willReadFrequently: true
    });

  tempCtx.drawImage(
    scratchCanvas,
    0,
    0,
    sampleSize,
    sampleSize
  );

  const data =
    tempCtx.getImageData(
      0,
      0,
      sampleSize,
      sampleSize
    ).data;

  let transparent = 0;

  const total =
    sampleSize * sampleSize;

  for (let i = 3; i < data.length; i += 4) {

    if (data[i] < 80) {
      transparent++;
    }
  }

  const progress =
    transparent / total;

  if (progress >= SCRATCH_THRESHOLD) {

    completeExperience();
  }
}


/* --------------------------------------------------
   COMPLETION
-------------------------------------------------- */

function completeExperience() {

  if (completed) return;

  completed = true;

  isScratching = false;

  /*
    Make sure the invitation is fully visible.
  */

  scratchCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  /*
    Start elegant confetti.
  */

  startConfetti();


  /*
    Give the guest a moment to see
    the revealed invitation.
  */

  setTimeout(() => {

    fade.classList.add("active");

  }, 1500);


  /*
    Then automatically open Canva.
  */

  setTimeout(() => {

    window.location.href = DESTINATION;

  }, 2300);
}


/* --------------------------------------------------
   CONFETTI
-------------------------------------------------- */

let confetti = [];
let confettiRunning = false;

function startConfetti() {

  confettiCanvas.classList.add("active");

  confetti = [];

  const amount =
    window.innerWidth < 600
      ? 75
      : 120;

  for (let i = 0; i < amount; i++) {

    confetti.push({
      x:
        Math.random() *
        window.innerWidth,

      y:
        -20 -
        Math.random() *
        window.innerHeight,

      width:
        3 +
        Math.random() * 5,

      height:
        6 +
        Math.random() * 10,

      rotation:
        Math.random() *
        Math.PI,

      rotationSpeed:
        -0.08 +
        Math.random() * 0.16,

      speed:
        1.5 +
        Math.random() * 3,

      drift:
        -0.7 +
        Math.random() * 1.4,

      opacity:
        0.65 +
        Math.random() * 0.35,

      /*
        Tinghun-inspired colors
      */

      color:
        [
          "#e7c56f",
          "#f5e5bd",
          "#fffaf0",
          "#b88932",
          "#9e151d"
        ][
          Math.floor(Math.random() * 5)
        ]
    });
  }

  if (!confettiRunning) {

    confettiRunning = true;

    requestAnimationFrame(
      animateConfetti
    );
  }
}


function animateConfetti() {

  const w = window.innerWidth;
  const h = window.innerHeight;

  confettiCtx.clearRect(
    0,
    0,
    w,
    h
  );

  for (const piece of confetti) {

    piece.y += piece.speed;
    piece.x += piece.drift;

    piece.rotation +=
      piece.rotationSpeed;

    if (piece.y > h + 30) {

      piece.y = -20;

      piece.x =
        Math.random() * w;
    }

    confettiCtx.save();

    confettiCtx.translate(
      piece.x,
      piece.y
    );

    confettiCtx.rotate(
      piece.rotation
    );

    confettiCtx.globalAlpha =
      piece.opacity;

    confettiCtx.fillStyle =
      piece.color;

    confettiCtx.fillRect(
      -piece.width / 2,
      -piece.height / 2,
      piece.width,
      piece.height
    );

    confettiCtx.restore();
  }

  if (completed) {

    requestAnimationFrame(
      animateConfetti
    );

  } else {

    confettiRunning = false;
  }
}


/* --------------------------------------------------
   RESIZE
-------------------------------------------------- */

window.addEventListener(
  "resize",
  () => {

    if (!completed) {
      resizeCanvases();
    }

  }
);


/* --------------------------------------------------
   START
-------------------------------------------------- */

invitation.addEventListener(
  "load",
  () => {

    resizeCanvases();

  }
);


/*
  If image is already cached.
*/

if (invitation.complete) {
  resizeCanvases();
}
