<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Galaxia Blox 2D Engine</title>

  <style>
    body {
      margin: 0;
      background: #05060a;
      color: #fff;
      font-family: Arial, sans-serif;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* LEFT CATEGORY BAR */
    #categories {
      width: 140px;
      background: #0b0c10;
      border-right: 2px solid #0af;
      padding: 10px;
      box-sizing: border-box;
    }

    .cat-btn {
      width: 100%;
      padding: 8px;
      margin-bottom: 8px;
      background: #0af;
      color: #000;
      border: none;
      cursor: pointer;
      font-weight: bold;
      border-radius: 5px;
      font-size: 13px;
    }

    .cat-btn:hover {
      background: #08c;
    }

    /* BLOCK PALETTE */
    #palette {
      width: 260px;
      background: #151515;
      border-right: 2px solid #0af;
      padding: 10px;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .block {
      padding: 8px 10px;
      background: #ffbf00;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: grab;
      user-select: none;
      font-weight: bold;
      font-size: 12px;
    }

    /* SCRIPT AREA */
    #scriptArea {
      flex: 1;
      background: #202020;
      position: relative;
      overflow: hidden;
    }

    .script-block {
      position: absolute;
      padding: 8px 10px;
      background: #ffbf00;
      border-radius: 6px;
      cursor: grab;
      user-select: none;
      font-weight: bold;
      font-size: 12px;
      min-width: 140px;
    }

    .script-block.event {
      background: #ff7f50;
    }

    .script-block.control {
      background: #ff6ad5;
    }

    /* STAGE + CONTROLS */
    #topBar {
      position: absolute;
      top: 5px;
      right: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
      z-index: 10;
    }

    #greenFlag {
      width: 30px;
      height: 30px;
      background: #0f0;
      border-radius: 50%;
      border: 2px solid #fff;
      cursor: pointer;
    }

    #stopBtn {
      width: 30px;
      height: 30px;
      background: #f00;
      border-radius: 50%;
      border: 2px solid #fff;
      cursor: pointer;
    }

    #stage {
      width: 360px;
      height: 260px;
      background: #000;
      border: 2px solid #0af;
      position: absolute;
      top: 45px;
      right: 10px;
    }

    #spriteInfo {
      position: absolute;
      right: 10px;
      top: 315px;
      font-size: 12px;
      background: rgba(0,0,0,0.6);
      padding: 4px 8px;
      border-radius: 4px;
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
