// Generate the sequence
const ITERATIONS = 66;
let sequence = [0];
let curr;

for (let i = 2; i < ITERATIONS; i++) {
  curr = sequence[i - 2];
  if (sequence.indexOf(curr - i) === -1 && curr - i > 0) {
    sequence.push(curr - i);
  } else {
    sequence.push(curr + i);
  }
}

// Options
const SCALING = 8;
const COLORSPEED = 5;

// Canvas setup
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

canvas.width =
  Math.max(...sequence) * SCALING - Math.min(...sequence) * SCALING + 4;

for (let i = 0, diff, max = 0; i < sequence.length - 1; i++) {
  diff = Math.abs(sequence[i + 1] - sequence[i]);
  if (diff > max) max = diff;
  canvas.height = max * SCALING + 4;
}

ctx.translate(2, 2);

// Animated drawing
const getPos = (i) => (sequence[i] + sequence[i + 1]) / 2;
const getRadius = (i) => Math.abs(sequence[i] - sequence[i + 1]) / 2;
const isNextLarger = (i) => sequence[i + 1] > sequence[i];
const isUp = (i) => Boolean(i % 2);
let nextframe,
  progress = 0;

const drawAnim = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let index = Math.floor(numSteps);

  for (let i = 0, pos, radius, spin = true; i < index; i++) {
    pos = (sequence[i] + sequence[i + 1]) / 2;
    radius = Math.abs(sequence[i + 1] - sequence[i]) / 2;
    ctx.beginPath();
    ctx.arc(
      pos * SCALING,
      canvas.height / 2,
      radius * SCALING,
      0,
      Math.PI,
      spin
    );
    ctx.stroke();
    spin = !spin;
  }

  let pos = getPos(index);
  let radius = getRadius(index);
  let arc = Math.PI * (numSteps - Math.floor(numSteps));
  let start = isNextLarger(index) ? Math.PI : 0;
  let end =
    (isUp(index) && !isNextLarger(index)) ||
    (!isUp(index) && isNextLarger(index))
      ? start + arc
      : start - arc;
  let spin =
    (isUp(index) && !isNextLarger(index)) ||
    (!isUp(index) && isNextLarger(index))
      ? false
      : true;

  ctx.beginPath();
  ctx.arc(pos * SCALING, canvas.height / 2, radius * SCALING, start, end, spin);
  ctx.stroke();

  if (progress < numSteps) {
    nextframe = requestAnimationFrame(drawAnim);
  }
  progress += 0.1;
};

const drawStatic = () => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  let spin = true;
  let pos, radius;
  for (let i = 0; i < sequence.length - 1; i++) {
    pos = (sequence[i] + sequence[i + 1]) / 2;
    radius = Math.abs(sequence[i + 1] - sequence[i]) / 2;
    ctx.beginPath();
    ctx.arc(
      pos * SCALING,
      canvas.height / 2,
      radius * SCALING,
      0,
      Math.PI,
      spin
    );
    ctx.stroke();
    spin = !spin;
  }
};

const rangeInput = document.getElementById("rangeInput");
const rangeValueDiv = document.getElementById("rangeValue");
let numSteps = rangeInput.value;

function onInputChangeHandler() {
  numSteps = rangeInput.value;
  rangeValueDiv.innerText = numSteps;
  progress = numSteps;
  cancelAnimationFrame(nextframe);
  drawAnim();
}

rangeInput.addEventListener("input", onInputChangeHandler);

document.getElementById("run").addEventListener("click", () => {
  drawAnim();
});

// Start the animation with the initial value of 65
progress = numSteps;
drawAnim();
drawStatic();
