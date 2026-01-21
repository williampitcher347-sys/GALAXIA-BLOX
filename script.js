<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Galaxia Blox — 2D Game Engine</title>

  <style>
    body {
      margin: 0;
      background: #05060a;
      color: #e0e0e0;
      font-family: "Segoe UI", Arial, sans-serif;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* LEFT CATEGORY BAR */
    #categories {
      width: 150px;
      background: linear-gradient(180deg, #0b0c10, #0a0a0f);
      border-right: 2px solid #0af;
      padding: 12px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .cat-btn {
      width: 100%;
      padding: 10px;
      background: #0af;
      color: #000;
      border: none;
      cursor: pointer;
      font-weight: bold;
      border-radius: 6px;
      font-size: 14px;
      transition: 0.15s;
    }

    .cat-btn:hover {
      background: #08c;
      transform: scale(1.05);
    }

    /* BLOCK PALETTE */
    #palette {
      width: 280px;
      background: #11131a;
      border-right: 2px solid #0af;
      padding: 12px;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .block {
      padding: 10px 12px;
      background: #ffbf00;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: grab;
      user-select: none;
      font-weight: bold;
      font-size: 13px;
      transition: 0.15s;
      box-shadow: 0 0 8px rgba(255, 191, 0, 0.4);
    }

    .block:hover {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(255, 191, 0, 0.7);
    }

    /* SCRIPT AREA */
    #scriptArea {
      flex: 1;
      background: #1a1c24;
      position: relative;
      overflow: hidden;
    }

    .script-block {
      position: absolute;
      padding: 10px 12px;
      background: #ffbf00;
      border-radius: 8px;
      cursor: grab;
      user-select: none;
      font-weight: bold;
      font-size: 13px;
      min-width: 160px;
      box-shadow: 0 0 8px rgba(255, 191, 0, 0.4);
      transition: 0.1s;
    }

    .script-block.event {
      background: #ff7f50;
      box-shadow: 0 0 8px rgba(255, 127, 80, 0.5);
    }

    .script-block.control {
      background: #ff6ad5;
      box-shadow: 0 0 8px rgba(255, 106, 213, 0.5);
    }

    /* TOP BAR */
    #topBar {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 12px;
      align-items: center;
      z-index: 10;
    }

    #greenFlag, #stopBtn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid #fff;
      cursor: pointer;
      transition: 0.15s;
    }

    #greenFlag {
      background: #00ff00;
    }

    #greenFlag:hover {
      transform: scale(1.1);
      background: #00dd00;
    }

    #stopBtn {
      background: #ff0000;
    }

    #stopBtn:hover {
      transform: scale(1.1);
      background: #dd0000;
    }

    /* STAGE */
    #stage {
      width: 380px;
      height: 280px;
      background: #000;
      border: 2px solid #0af;
      position: absolute;
      top: 60px;
      right: 10px;
      box-shadow: 0 0 12px rgba(0, 170, 255, 0.5);
    }

    #spriteInfo {
      position: absolute;
      right: 10px;
      top: 350px;
      font-size: 13px;
      background: rgba(0,0,0,0.6);
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #0af;
    }
  </style>
</head>

<body>

  <!-- LEFT CATEGORY BAR -->
  <div id="categories">
    <button class="cat-btn" data-cat="movement">Movement</button>
    <button class="cat-btn" data-cat="looks">Looks</button>
    <button class="cat-btn" data-cat="events">Events</button>
    <button class="cat-btn" data-cat="control">Control</button>
    <button class="cat-btn" data-cat="sensing">Sensing</button>
    <button class="cat-btn" data-cat="operators">Operators</button>
    <button class="cat-btn" data-cat="variables">Variables</button>
    <button class="cat-btn" data-cat="map">Map</button>
    <button class="cat-btn" data-cat="custom">Custom</button>
    <button class="cat-btn" data-cat="advanced">Advanced</button>
  </div>

  <!-- BLOCK PALETTE -->
  <div id="palette"></div>

  <!-- SCRIPT AREA + STAGE -->
  <div id="scriptArea">
    <div id="topBar">
      <div id="greenFlag" title="Start"></div>
      <div id="stopBtn" title="Stop"></div>
    </div>
    <canvas id="stage"></canvas>
    <div id="spriteInfo">Sprite: x=0 y=0</div>
  </div>

  <script src="script.js"></script>
</body>
</html>
