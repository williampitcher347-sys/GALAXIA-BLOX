/*  
   GALAXIA 3D GAME CREATOR – ADVANCED ENGINE  
   Features added:
   - Walls + collision
   - Floors
   - Triggers
   - Event system (onTouch, onClick, onStart)
   - Player controller with collision
   - Object behaviors
*/

//////////////////////////////////////////////////////
// BASIC THREE.JS SETUP
//////////////////////////////////////////////////////

const container = document.getElementById("threeContainer");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  2000
);
camera.position.set(8, 6, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0x00aaff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const grid = new THREE.GridHelper(40, 40, 0x0af, 0x033);
scene.add(grid);

//////////////////////////////////////////////////////
// ENGINE STATE
//////////////////////////////////////////////////////

let objects = []; // {id, name, type, mesh, speed, events: []}
let selectedId = null;
let currentTool = "select";
let playMode = false;
let nextId = 1;

const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

//////////////////////////////////////////////////////
// OBJECT CREATION HELPERS
//////////////////////////////////////////////////////

function createMesh(type, color = 0x00aaff) {
  let geom;

  switch (type) {
    case "cube":
      geom = new THREE.BoxGeometry(1, 1, 1);
      break;

    case "sphere":
      geom = new THREE.SphereGeometry(0.5, 24, 24);
      break;

    case "wall":
      geom = new THREE.BoxGeometry(5, 3, 0.5);
      break;

    case "floor":
      geom = new THREE.BoxGeometry(20, 0.5, 20);
      break;

    case "trigger":
      geom = new THREE.BoxGeometry(2, 2, 2);
      break;
  }

  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.2,
    roughness: 0.6,
    transparent: type === "trigger",
    opacity: type === "trigger" ? 0.25 : 1
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function addObject(type) {
  const mesh = createMesh(type);
  mesh.position.set(0, 0.5, 0);
  scene.add(mesh);

  const obj = {
    id: nextId++,
    name: type.toUpperCase() + " " + nextId,
    type,
    mesh,
    speed: 3,
    events: [] // NEW: event list
  };

  objects.push(obj);
  refreshObjectList();
  selectObject(obj.id);
}

//////////////////////////////////////////////////////
// EVENT SYSTEM
//////////////////////////////////////////////////////

/*
   EVENT FORMAT:
   {
     trigger: "onTouch" | "onClick" | "onStart",
     action: "move" | "rotate" | "teleport" | "delete" | "color",
     params: {...}
   }
*/

function runEvents(triggerType, colliderObj = null) {
  objects.forEach(obj => {
    obj.events.forEach(ev => {
      if (ev.trigger !== triggerType) return;

      // If onTouch, check collision
      if (triggerType === "onTouch" && colliderObj) {
        if (!checkCollision(obj.mesh, colliderObj.mesh)) return;
      }

      runAction(obj, ev);
    });
  });
}

function runAction(obj, ev) {
  switch (ev.action) {
    case "move":
      obj.mesh.position.x += ev.params.x || 0;
      obj.mesh.position.y += ev.params.y || 0;
      obj.mesh.position.z += ev.params.z || 0;
      break;

    case "rotate":
      obj.mesh.rotation.y += ev.params.y || 0;
      break;

    case "teleport":
      obj.mesh.position.set(ev.params.x, ev.params.y, ev.params.z);
      break;

    case "delete":
      scene.remove(obj.mesh);
      objects = objects.filter(o => o.id !== obj.id);
      break;

    case "color":
      obj.mesh.material.color.set(ev.params.color);
      break;
  }
}

//////////////////////////////////////////////////////
// COLLISION SYSTEM
//////////////////////////////////////////////////////

function checkCollision(a, b) {
  a.geometry.computeBoundingBox();
  b.geometry.computeBoundingBox();

  const boxA = a.geometry.boundingBox.clone();
  const boxB = b.geometry.boundingBox.clone();

  boxA.applyMatrix4(a.matrixWorld);
  boxB.applyMatrix4(b.matrixWorld);

  return boxA.intersectsBox(boxB);
}

//////////////////////////////////////////////////////
// PLAYER CONTROLLER (in play mode)
//////////////////////////////////////////////////////

function updatePlayerMovement() {
  const player = objects.find(o => o.type === "cube" && o.id === selectedId);
  if (!player) return;

  const speed = player.speed * 0.1;

  const oldPos = player.mesh.position.clone();

  if (keys["ArrowUp"]) player.mesh.position.z -= speed;
  if (keys["ArrowDown"]) player.mesh.position.z += speed;
  if (keys["ArrowLeft"]) player.mesh.position.x -= speed;
  if (keys["ArrowRight"]) player.mesh.position.x += speed;

  // Collision with walls
  objects.forEach(o => {
    if (o.type === "wall" || o.type === "floor") {
      if (checkCollision(player.mesh, o.mesh)) {
        player.mesh.position.copy(oldPos);
      }
    }
  });

  // Trigger events
  objects.forEach(o => {
    if (o.type === "trigger") {
      if (checkCollision(player.mesh, o.mesh)) {
        runEvents("onTouch", player);
      }
    }
  });
}

//////////////////////////////////////////////////////
// RAYCAST SELECTION
//////////////////////////////////////////////////////

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("mousedown", e => {
  if (currentTool !== "select") {
    if (currentTool === "cube") addObject("cube");
    if (currentTool === "sphere") addObject("sphere");
    if (currentTool === "wall") addObject("wall");
    if (currentTool === "floor") addObject("floor");
    if (currentTool === "trigger") addObject("trigger");
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const meshes = objects.map(o => o.mesh);
  const hits = raycaster.intersectObjects(meshes);

  if (hits.length > 0) {
    const hitMesh = hits[0].object;
    const obj = objects.find(o => o.mesh === hitMesh);
    if (obj) selectObject(obj.id);

    // Click events
    runEvents("onClick");
  } else {
    selectedId = null;
    refreshObjectList();
    updatePropertiesPanel();
  }
});

//////////////////////////////////////////////////////
// UI BINDINGS (same as before)
//////////////////////////////////////////////////////

// (Your existing UI code stays the same — selection, properties, save/load, etc.)

//////////////////////////////////////////////////////
// MAIN LOOP
//////////////////////////////////////////////////////

function update() {
  controls.update();

  if (playMode) {
    updatePlayerMovement();
  }
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

animate();
