const invitation =
  document.getElementById("invitation");

const scratchCanvas =
  document.getElementById("scratchCanvas");

const scratchCtx =
  scratchCanvas.getContext("2d", {
    willReadFrequently: true
  });

const confettiCanvas =
  document.getElementById("confettiCanvas");

const confettiCtx =
  confettiCanvas.getContext("2d");

const instruction =
  document.getElementById("instruction");

const fade =
  document.getElementById("fade");


/* --------------------------------
   SETTINGS
-------------------------------- */

const DESTINATION =
  "https://printedbystaygold.com/demo-pastelbloom-chinese-elegance";

const SCRATCH_THRESHOLD = 0.75;


/* --------------------------------
   VARIABLES
-------------------------------- */

let isScratching = false;

let completed = false;

let lastPoint = null;

let lastCheck = 0;

let brushTexture = null;


/* --------------------------------
   CARD SIZE
-------------------------------- */

let card = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};


/* --------------------------------
   RESIZE
-------------------------------- */

function resizeCanvases() {

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  const width =
    window.innerWidth;

  const height =
    window.innerHeight;


  scratchCanvas.width =
    Math.round(width * dpr);

  scratchCanvas.height =
    Math.round(height * dpr);

  scratchCanvas.style.width =
    width + "px";

  scratchCanvas.style.height =
    height + "px";


  scratchCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  confettiCanvas.width =
    Math.round(width * dpr);

  confettiCanvas.height =
    Math.round(height * dpr);

  confettiCanvas.style.width =
    width + "px";

  confettiCanvas.style.height =
    height + "px";


  confettiCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  calculateCard();

  createScratchCard();
}


/* --------------------------------
   CALCULATE CARD POSITION
-------------------------------- */

function calculateCard() {

  const rect =
    invitation.getBoundingClientRect();

  card.x = rect.left;

  card.y = rect.top;

  card.width = rect.width;

  card.height = rect.height;
}


/* --------------------------------
   CREATE RED SCRATCH CARD
-------------------------------- */

function createScratchCard() {

  const w =
    window.innerWidth;

  const h =
    window.innerHeight;


  scratchCtx.clearRect(
    0,
    0,
    w,
    h
  );


  /*
    IMPORTANT:

    Only the actual invitation/card
    area becomes red.

    Outside remains OFF-WHITE.
  */

  scratchCtx.save();

  scratchCtx.beginPath();

  scratchCtx.rect(
    card.x,
    card.y,
    card.width,
    card.height
  );

  scratchCtx.clip();


  /* RED GRADIENT */

  const gradient =
    scratchCtx.createLinearGradient(
      card.x,
      card.y,
      card.x + card.width,
      card.y + card.height
    );

  gradient.addColorStop(
    0,
    "#a81720"
  );

  gradient.addColorStop(
    0.5,
    "#8f1018"
  );

  gradient.addColorStop(
    1,
    "#65080e"
  );

  scratchCtx.fillStyle =
    gradient;

  scratchCtx.fillRect(
    card.x,
    card.y,
    card.width,
    card.height
  );


  /* SUBTLE TEXTURE */

  scratchCtx.save();

  scratchCtx.globalAlpha =
    0.08;

  for (
    let x = card.x - card.height;
    x < card.x + card.width + card.height;
    x += 24
  ) {

    scratchCtx.beginPath();

    scratchCtx.moveTo(
      x,
      card.y
    );

    scratchCtx.lineTo(
      x + card.height,
      card.y + card.height
    );

    scratchCtx.strokeStyle =
      "#f2d28c";

    scratchCtx.lineWidth = 1;

    scratchCtx.stroke();
  }

  scratchCtx.restore();


  /* BORDER */

  const margin =
    Math.min(
      card.width,
      card.height
    ) * 0.045;


  scratchCtx.strokeStyle =
    "rgba(239, 201, 119, 0.9)";

  scratchCtx.lineWidth = 1.5;

  scratchCtx.strokeRect(
    card.x + margin,
    card.y + margin,
    card.width - margin * 2,
    card.height - margin * 2
  );


  scratchCtx.strokeStyle =
    "rgba(239, 201, 119, 0.35)";

  scratchCtx.lineWidth = 1;

  scratchCtx.strokeRect(
    card.x + margin + 7,
    card.y + margin + 7,
    card.width - (margin + 7) * 2,
    card.height - (margin + 7) * 2
  );


  /* 囍 */

  scratchCtx.fillStyle =
    "#edc779";

  scratchCtx.globalAlpha =
    0.9;

  scratchCtx.font =
    "bold " +
    Math.min(
      card.width,
      card.height
    ) *
    0.18 +
    "px serif";

  scratchCtx.textAlign =
    "center";

  scratchCtx.textBaseline =
    "middle";

  scratchCtx.fillText(
    "囍",
    card.x + card.width / 2,
    card.y + card.height * 0.42
  );


  /* TEXT */

  scratchCtx.globalAlpha = 1;

  scratchCtx.fillStyle =
    "#f2d59b";

  scratchCtx.font =
    "500 " +
    Math.max(
      13,
      Math.min(
        card.width,
        card.height
      ) * 0.022
    ) +
    "px Georgia";

  scratchCtx.fillText(
    "A SPECIAL INVITATION AWAITS",
    card.x + card.width / 2,
    card.y + card.height * 0.58
  );


  scratchCtx.restore();


  createBrushTexture();
}


/* --------------------------------
   BRUSH TEXTURE
-------------------------------- */

function createBrushTexture() {

  const size = 160;

  brushTexture =
    document.createElement("canvas");

  brushTexture.width = size;
  brushTexture.height = size;

  const ctx =
    brushTexture.getContext("2d");

  const image =
    ctx.createImageData(
      size,
      size
    );

  const center =
    size / 2;


  for (
    let y = 0;
    y < size;
    y++
  ) {

    for (
      let x = 0;
      x < size;
      x++
    ) {

      /*
        ELONGATED brush.

        NOT circular.
      */

      const nx =
        (x - center) / 72;

      const ny =
        (y - center) / 27;


      const distance =
        Math.sqrt(
          nx * nx +
          ny * ny
        );


      /*
        Organic edge.
      */

      const noise =
        Math.sin(x * 0.27) *
        Math.sin(y * 0.19) *
        0.12;


      const edge =
        distance + noise;


      let alpha = 0;


      if (edge < 1) {

        alpha =
          (1 - edge) * 255;

        alpha *=
          0.75 +
          Math.random() * 0.25;
      }


      const index =
        (y * size + x) * 4;


      image.data[index] =
        255;

      image.data[index + 1] =
        255;

      image.data[index + 2] =
        255;

      image.data[index + 3] =
        alpha;
    }
  }


  ctx.putImageData(
    image,
    0,
    0
  );
}


/* --------------------------------
   GET POINTER POSITION
-------------------------------- */

function getPoint(event) {

  const rect =
    scratchCanvas.getBoundingClientRect();


  return {
    x:
      event.clientX -
      rect.left,

    y:
      event.clientY -
      rect.top
  };
}


/* --------------------------------
   CHECK IF POINTER IS ON CARD
-------------------------------- */

function isInsideCard(point) {

  return (
    point.x >= card.x &&
    point.x <=
      card.x + card.width &&

    point.y >= card.y &&
    point.y <=
      card.y + card.height
  );
}


/* --------------------------------
   SMOOTH SCRATCH
-------------------------------- */

function scratchTo(point) {

  if (!lastPoint) {

    lastPoint = point;

    return;
  }


  const dx =
    point.x -
    lastPoint.x;

  const dy =
    point.y -
    lastPoint.y;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (distance < 1) return;


  /*
    Small interpolation steps.

    This makes desktop mouse movement
    smooth even when the mouse moves fast.
  */

  const steps =
    Math.ceil(
      distance / 4
    );


  const angle =
    Math.atan2(
      dy,
      dx
    );


  for (
    let i = 1;
    i <= steps;
    i++
  ) {

    const t =
      i / steps;


    const x =
      lastPoint.x +
      dx * t;

    const y =
      lastPoint.y +
      dy * t;


    /*
      Only scratch inside card.
    */

    if (
      x >= card.x &&
      x <= card.x + card.width &&
      y >= card.y &&
      y <= card.y + card.height
    ) {

      stampBrush(
        x,
        y,
        angle
      );
    }
  }


  lastPoint = point;


  const now =
    performance.now();


  if (
    now - lastCheck >
    300
  ) {

    lastCheck = now;

    checkProgress();
  }
}


/* --------------------------------
   STAMP BRUSH
-------------------------------- */

function stampBrush(
  x,
  y,
  angle
) {

  if (!brushTexture) return;


  scratchCtx.save();


  scratchCtx.globalCompositeOperation =
    "destination-out";


  /*
    Keep erasing confined to card.
  */

  scratchCtx.beginPath();

  scratchCtx.rect(
    card.x,
    card.y,
    card.width,
    card.height
  );

  scratchCtx.clip();


  scratchCtx.translate(
    x,
    y
  );


  scratchCtx.rotate(
    angle
  );


  /*
    Slight variation.

    Still one continuous rubbing texture.
  */

  const scaleX =
    0.95 +
    Math.random() * 0.15;

  const scaleY =
    0.90 +
    Math.random() * 0.10;


  scratchCtx.scale(
    scaleX,
    scaleY
  );


  scratchCtx.globalAlpha =
    0.9;


  scratchCtx.drawImage(
    brushTexture,
    -80,
    -80,
    160,
    160
  );


  scratchCtx.restore();
}


/* --------------------------------
   POINTER DOWN
-------------------------------- */

scratchCanvas.addEventListener(
  "pointerdown",
  event => {

    if (completed) return;


    event.preventDefault();


    const point =
      getPoint(event);


    /*
      Don't start scratching
      outside the red card.
    */

    if (
      !isInsideCard(point)
    ) {

      return;
    }


    isScratching = true;


    /*
      VERY IMPORTANT FOR PC.

      Capture the mouse pointer so
      scratching continues even if
      the cursor moves quickly.
    */

    try {

      scratchCanvas.setPointerCapture(
        event.pointerId
      );

    } catch (error) {}


    lastPoint =
      point;


    instruction.classList.add(
      "hidden"
    );


    stampBrush(
      point.x,
      point.y,
      0
    );

  },
  {
    passive: false
  }
);


/* --------------------------------
   POINTER MOVE
-------------------------------- */

scratchCanvas.addEventListener(
  "pointermove",
  event => {

    if (
      !isScratching ||
      completed
    ) {

      return;
    }


    event.preventDefault();


    scratchTo(
      getPoint(event)
    );

  },
  {
    passive: false
  }
);


/* --------------------------------
   STOP
-------------------------------- */

function stopScratching(event) {

  isScratching = false;

  lastPoint = null;


  try {

    if (
      event &&
      scratchCanvas.hasPointerCapture(
        event.pointerId
      )
    ) {

      scratchCanvas.releasePointerCapture(
        event.pointerId
      );

    }

  } catch (error) {}


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


/* --------------------------------
   PROGRESS
-------------------------------- */

function checkProgress() {

  if (completed) return;


  const sampleSize = 80;


  const temp =
    document.createElement(
      "canvas"
    );


  temp.width =
    sampleSize;

  temp.height =
    sampleSize;


  const ctx =
    temp.getContext(
      "2d",
      {
        willReadFrequently: true
      }
    );


  /*
    Only measure the actual card.
  */

  ctx.drawImage(
    scratchCanvas,

    card.x,
    card.y,
    card.width,
    card.height,

    0,
    0,
    sampleSize,
    sampleSize
  );


  const data =
    ctx.getImageData(
      0,
      0,
      sampleSize,
      sampleSize
    ).data;


  let transparent = 0;


  const total =
    sampleSize *
    sampleSize;


  for (
    let i = 3;
    i < data.length;
    i += 4
  ) {

    if (
      data[i] < 80
    ) {

      transparent++;
    }
  }


  const progress =
    transparent /
    total;


  if (
    progress >=
    SCRATCH_THRESHOLD
  ) {

    completeExperience();
  }
}


/* --------------------------------
   COMPLETE
-------------------------------- */

function completeExperience() {

  if (completed) return;


  completed = true;

  isScratching = false;


  /*
    Remove remaining red layer.
  */

  scratchCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );


  startConfetti();


  setTimeout(
    () => {

      fade.classList.add(
        "active"
      );

    },
    1500
  );


  setTimeout(
    () => {

      window.location.href =
        DESTINATION;

    },
    2300
  );
}


/* --------------------------------
   CONFETTI
-------------------------------- */

let confetti = [];

let confettiRunning = false;


function startConfetti() {

  confettiCanvas.classList.add(
    "active"
  );


  confetti = [];


  const amount =
    window.innerWidth < 600
      ? 75
      : 120;


  for (
    let i = 0;
    i < amount;
    i++
  ) {

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

      color:
        [
          "#e7c56f",
          "#f5e5bd",
          "#fffaf0",
          "#b88932",
          "#9e151d"
        ][
          Math.floor(
            Math.random() * 5
          )
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

  const w =
    window.innerWidth;

  const h =
    window.innerHeight;


  confettiCtx.clearRect(
    0,
    0,
    w,
    h
  );


  for (
    const piece of confetti
  ) {

    piece.y +=
      piece.speed;

    piece.x +=
      piece.drift;

    piece.rotation +=
      piece.rotationSpeed;


    if (
      piece.y >
      h + 30
    ) {

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


/* --------------------------------
   START
-------------------------------- */

invitation.addEventListener(
  "load",
  () => {

    resizeCanvases();

  }
);


window.addEventListener(
  "resize",
  () => {

    if (!completed) {
      resizeCanvases();
    }

  }
);


if (invitation.complete) {

  resizeCanvases();
}
