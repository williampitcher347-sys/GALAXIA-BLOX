// ===============================
// BLOCK DEFINITIONS
// ===============================

const BLOCKS = {
  movement: [
    "move 10 steps",
    "turn right 15°",
    "turn left 15°",
    "go to x:0 y:0",
    "glide 1s to x:100 y:100",
    "change x by 10",
    "change y by 10",
    "set x to 0",
    "set y to 0",
    "point in direction 90"
  ],

  looks: [
    "say Hello",
    "say Hello for 2s",
    "think Hmm",
    "change color",
    "set size to 100%",
    "hide",
    "show",
    "switch costume",
    "change ghost effect",
    "clear effects"
  ],

  events: [
    "when green flag clicked",
    "when sprite clicked",
    "when key pressed",
    "when backdrop switches",
    "when timer > 5",
    "when touching edge",
    "when touching sprite",
    "broadcast message",
    "when I receive message",
    "when stage clicked"
  ],

  control: [
    "repeat 10",
    "forever",
    "wait 1 second",
    "if condition",
    "if else",
    "stop all",
    "stop script",
    "repeat until",
    "wait until",
    "create clone"
  ],

  sensing: [
    "touching mouse?",
    "touching color?",
    "mouse x",
    "mouse y",
    "key pressed?",
    "distance to sprite",
    "ask and wait",
    "answer",
    "loudness",
    "timer"
  ],

  operators: [
    "pick random 1 to 10",
    "join text",
    "letter of text",
    "length of text",
    "mod",
    "round",
    "+",
    "-",
    "*",
    "/"
  ],

  variables: [
    "set variable",
    "change variable",
    "show variable",
    "hide variable",
    "add to list",
    "delete from list",
    "replace item",
    "insert item",
    "length of list",
    "item of list"
  ],

  map: [
    "set tile",
    "get tile",
    "load map",
    "save map",
    "fill area",
    "spawn enemy",
    "spawn item",
    "set spawn point",
    "set camera",
    "scroll map"
  ],

  custom: [
    "define function",
    "call function",
    "create event",
    "emit event",
    "custom block 1",
    "custom block 2",
    "custom block 3",
    "custom block 4",
    "custom block 5",
    "custom block 6"
  ],

  advanced: [
    "run JS code",
    "log to console",
    "set physics",
    "apply force",
    "set gravity",
    "spawn particle",
    "play sound",
    "load sprite",
    "save project",
    "load project"
  ]
};

// ===============================
// UI ELEMENTS
// ===============================

const palette = document.getElementById("palette");
const scriptArea = document.getElementById("scriptArea");

// ===============================
// CATEGORY SWITCHING
// ===============================

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.onclick = () => {
    const cat = btn.dataset.cat;
    loadCategory(cat);
  };
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

// ===============================
// DRAGGING + SCRIPT AREA
// ===============================

let dragData = null;

function dragStart(e) {
  dragData = {
    text: e.target.textContent
  };
}

scriptArea.addEventListener("dragover", e => e.preventDefault());

scriptArea.addEventListener("drop", e => {
  const block = document.createElement("div");
  block.className = "script-block";
  block.textContent = dragData.text;
  block.style.left = e.offsetX + "px";
  block.style.top = e.offsetY + "px";

  makeDraggable(block);
  scriptArea.appendChild(block);
});

// ===============================
// MAKE SCRIPT BLOCKS DRAGGABLE
// ===============================

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
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
}
