console.log("Galaxia Blox — 2D Engine Loaded");

/* ============================================================
   BLOCK DEFINITIONS (100 BLOCKS)
   ============================================================ */

const BLOCKS = {
  movement: [
    "move 10 steps",
    "move -10 steps",
    "change x by 10",
    "change x by -10",
    "change y by 10",
    "change y by -10",
    "go to x:0 y:0",
    "go to random position",
    "point in direction 90",
    "point in direction -90"
  ],
  looks: [
    "say Hello",
    "say Hello for 2s",
    "say random message",
    "hide sprite",
    "show sprite",
    "set size to 50%",
    "set size to 100%",
    "set size to 150%",
    "change color",
    "reset look"
  ],
  events: [
    "when green flag clicked",
    "when sprite clicked",
    "when key space pressed",
    "when key up pressed",
    "when key down pressed",
    "when key left pressed",
    "when key right pressed",
    "when map loaded",
    "when variable changes",
    "when custom event"
  ],
  control: [
    "wait 1 second",
    "wait 0.5 seconds",
    "repeat 5",
    "repeat 10",
    "forever",
    "if touching edge",
    "if x > 100",
    "if y > 100",
    "stop script",
    "stop all"
  ],
  sensing: [
    "touching edge?",
    "touching center?",
    "mouse x",
    "mouse y",
    "key space pressed?",
    "key up pressed?",
    "key down pressed?",
    "key left pressed?",
    "key right pressed?",
    "distance to center"
  ],
  operators: [
    "pick random -10 to 10",
    "add 1 + 1",
    "subtract 5 - 3",
    "multiply 2 * 3",
    "divide 10 / 2",
    "greater than",
    "less than",
    "equal to",
    "and",
    "or"
  ],
  variables: [
    "set score to 0",
    "change score by 1",
    "change score by -1",
    "set health to 100",
    "change health by -10",
    "show score",
    "hide score",
    "show health",
    "hide health",
    "reset variables"
  ],
  map: [
    "scroll map right",
    "scroll map left",
    "scroll map up",
    "scroll map down",
    "set camera center",
    "spawn enemy",
    "spawn coin",
    "set spawn point",
    "load level 1",
    "load level 2"
  ],
  custom: [
    "define custom action",
    "run custom action",
    "emit custom event",
    "on custom event",
    "set custom flag",
    "clear custom flag",
    "toggle custom flag",
    "log custom",
    "custom block A",
    "custom block B"
  ],
  advanced: [
    "run debug log",
    "freeze sprite",
    "unfreeze sprite",
    "set max speed",
    "set friction",
    "enable gravity",
    "disable gravity",
    "play sound",
    "stop sound",
    "reset engine"
  ]
};

/* ============================================================
   UI ELEMENTS
   ============================================================ */

const palette = document.getElementById("palette");
const scriptArea = document.getElementById("scriptArea");
const stageCanvas = document.getElementById("stage");
const spriteInfo = document.getElementById("spriteInfo");
const ctx = stageCanvas.getContext("2d");

stageCanvas.width = 380;
stageCanvas.height = 280;

/* ============================================================
   SPRITE STATE
   ============================================================ */

const sprite = {
  x: 0,
  y: 0,
  size: 40,
  visible: true,
  color: "#0af"
};

let running = false;

/* ============================================================
   CATEGORY SWITCHING
   ============================================================ */

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.onclick = () => loadCategory(btn.dataset.cat);
});

function loadCategory(cat) {
  palette.innerHTML = "";
  BLOCKS[cat].forEach(text => {
    const block = document.createElement("div");
    block.className = "block";
    block.textContent = text;
    block.draggable = true;
    block.ondragstart = dragStart;
    palette.appendChild(block);
  });
}

loadCategory("movement");

/* ============================================================
   DRAGGING FROM PALETTE TO SCRIPT AREA
   ============================================================ */

let dragData = null;

function dragStart(e) {
  dragData = { text: e.target.textContent };
}

scriptArea.addEventListener("dragover", e => e.preventDefault());

scriptArea.addEventListener("drop", e => {
  if (!dragData) return;

  const block = document.createElement("div");
  block.className = "script-block";
  block.textContent = dragData.text;

  if (dragData.text.startsWith("when")) block.classList.add("event");
  if (dragData.text.startsWith("repeat") || dragData.text.startsWith("forever")) block.classList.add("control");

  block.style.left = e.offsetX + "px";
  block.style.top = e.offsetY + "px";

  makeDraggable(block);
  scriptArea.appendChild(block);
});

/* ============================================================
   DRAGGING + SNAPPING
   ============================================================ */

function makeDraggable(el) {
  let offsetX, offsetY;

  el.onmousedown = e => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    function move(ev) {
      el.style.left = ev.pageX - scriptArea.offsetLeft - offsetX + "px";
      el.style.top = ev.pageY - scriptArea.offsetTop - offsetY + "px";
    }

    function up() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      snapBlock(el);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
}

function snapBlock(el) {
  const blocks = Array.from(scriptArea.querySelectorAll(".script-block")).filter(b => b !== el);

  let closest = null;
  let closestDist = 9999;

  const elRect = el.getBoundingClientRect();

  blocks.forEach(b => {
    const r = b.getBoundingClientRect();
    const dx = elRect.left - r.left;
    const dy = elRect.top - (r.bottom + 6);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(dx) < 40 && Math.abs(dy) < 25 && dist < closestDist) {
      closestDist = dist;
      closest = b;
    }
  });

  if (closest) {
    const r = closest.getBoundingClientRect();
    const parentR = scriptArea.getBoundingClientRect();
    el.style.left = r.left - parentR.left + "px";
    el.style.top = r.bottom - parentR.top + 6 + "px";
  }
}

/* ============================================================
   STAGE RENDERING
   ============================================================ */

function drawStage() {
  ctx.clearRect(0, 0, stageCanvas.width, stageCanvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, stageCanvas.width, stageCanvas.height);

  if (sprite.visible) {
    ctx.fillStyle = sprite.color;
    ctx.fillRect(
      stageCanvas.width / 2 + sprite.x - sprite.size / 2,
      stageCanvas.height / 2 - sprite.y - sprite.size / 2,
      sprite.size,
      sprite.size
    );
  }

  spriteInfo.textContent = `Sprite: x=${sprite.x} y=${sprite.y}`;
}

drawStage();

/* ============================================================
   SCRIPT EXECUTION
   ============================================================ */

const greenFlag = document.getElementById("greenFlag");
const stopBtn = document.getElementById("stopBtn");

greenFlag.onclick = () => {
  running = true;
  runScripts();
};

stopBtn.onclick = () => {
  running = false;
};

function getScriptBlocks() {
  return Array.from(scriptArea.querySelectorAll(".script-block"))
    .map(b => ({
      el: b,
      text: b.textContent,
      top: parseInt(b.style.top || "0", 10)
    }))
    .sort((a, b) => a.top - b.top);
}

async function runScripts() {
  resetSprite();

  const blocks = getScriptBlocks();
  const eventBlocks = blocks.filter(b => b.text.startsWith("when green flag clicked"));

  for (const ev of eventBlocks) {
    await runFromBlock(ev, blocks);
  }
}

async function runFromBlock(startBlock, allBlocks) {
  let index = allBlocks.indexOf(startBlock) + 1;

  while (index < allBlocks.length && running) {
    const block = allBlocks[index];
    await executeBlock(block.text);
    index++;
  }
}

function resetSprite() {
  sprite.x = 0;
  sprite.y = 0;
  sprite.size = 40;
  sprite.visible = true;
  sprite.color = "#0af";
  drawStage();
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function executeBlock(text) {
  if (!running) return;

  // MOVEMENT
  if (text === "move 10 steps") sprite.x += 10;
  if (text === "move -10 steps") sprite.x -= 10;
  if (text === "change x by 10") sprite.x += 10;
  if (text === "change x by -10") sprite.x -= 10;
  if (text === "change y by 10") sprite.y += 10;
  if (text === "change y by -10") sprite.y -= 10;
  if (text === "go to x:0 y:0") sprite.x = sprite.y = 0;
  if (text === "go to random position") {
    sprite.x = Math.floor(Math.random() * 200 - 100);
    sprite.y = Math.floor(Math.random() * 150 - 75);
  }

  // LOOKS
  if (text === "hide sprite") sprite.visible = false;
  if (text === "show sprite") sprite.visible = true;
  if (text === "set size to 50%") sprite.size = 20;
  if (text === "set size to 100%") sprite.size = 40;
  if (text === "set size to 150%") sprite.size = 60;
  if (text === "change color") sprite.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (text === "reset look") {
    sprite.size = 40;
    sprite.color = "#0af";
    sprite.visible = true;
  }

  // CONTROL
  if (text === "wait 1 second") await sleep(1000);
  if (text === "wait 0.5 seconds") await sleep(500);
  if (text === "stop script") running = false;
  if (text === "stop all") running = false;

  drawStage();
}
