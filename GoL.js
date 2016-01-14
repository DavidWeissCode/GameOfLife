////////////////////////////////
// execution

var cellArray;
var cellArrayHelper;
var isRunning = true; // TODO
var iterationCount = 0;
const size = 20;

window.onload = function() {
  cellArray = new Array(size);
  for (var i=0; i<size; i++) {
    cellArray[i] = new Array(size);
  }
  cellArrayHelper = new Array(size);
  for (var i=0; i<size; i++) {
    cellArrayHelper[i] = new Array(size);
  }
  createWorld(size, false);
}


////////////////////////////////
// declaration

function createWorld(size, isTorus) { // max.size = 1000
  var currentHTML = document.getElementById("world").innerHTML;
  
  currentHTML += "<table onmousedown='iterateWorld(1)'>";
  for (var i=0; i<size; i++) { // x-coord./rows: from top to bot = from 0 to size-1
    currentHTML += "<tr>";   
    for (var j=0; j<size; j++) { // y-coord./columns: from left to right = from 0 to size-1
      var jlocal = j; //nötig?
      var ilocal = i;
      switch(jlocal.toString().length) {
        case 1: // one digit?
          jlocal = "00" + jlocal; break;
        case 2: // two digits?
          jlocal = "0" + jlocal; break; // transform j and i into a three digit coordinate
        default: break;
      }
      switch(ilocal.toString().length) {
        case 1:
          ilocal = "00" + ilocal; break;
        case 2:
          ilocal = "0" + ilocal; break;
        default: break;
      }
      currentHTML += '<td id="' + jlocal + '' + ilocal + '"' +  // coords: (x,y) / (j,i) / (column,row)
      ' onmouseover="emphasizeCell(event)" onmouseout="normalizeCell(event)"></td>'; // write HTML for graphical cell creation
      cellArray[j][i] = "dead"; // set status for iteration
    }
    currentHTML += "</tr>";
  }
  currentHTML += "</table>";
  document.getElementById("world").innerHTML = currentHTML;
  
  createOctagon();
  createBlinker();
  createSegler();
  //iterateWorld(10);
}

function iterateWorld(iterations) {
  for (var i=0; i<iterations; i++) { 
    for (var x=1; x<cellArray.length-1; x++) { // calculate next status of cellArray
      for (var y=1; y<cellArray.length-1; y++) { // ACHTUNG: Rand soll immer "dead" sein!!!!!!!
        var aliveNeighbours = countNeighbours(x, y);
        var ownStatus = cellArray[x][y]; // "dead" or "alive"
        cellArrayHelper[x][y] = assignNextStatus(aliveNeighbours,ownStatus);
      }
    }
    
    for (var x=1; x<cellArray.length-1; x++) { // helper array
      for (var y=1; y<cellArray.length-1; y++) {
        cellArray[x][y] = cellArrayHelper[x][y];
      }
    }

    for (var x=1; x<cellArray.length-1; x++) { // print the new status of cellArray
      for (var y=1; y<cellArray.length-1; y++) {
        if (cellArray[x][y] == "alive") {
          document.getElementById(indexToStr(x, y)).setAttribute("style", "background-color:#82B346");
        } else {
          document.getElementById(indexToStr(x, y)).setAttribute("style", "background-color:#DBBE7F");
        }
      }
    }
  }
  console.log("STEP " + ++iterationCount);
}

function toggleLife() { // TODO - learn more about timing in JS
  for(var i=1; i<=44; i++) {
    setTimeout(toggleHelper, 250*i);
  }
}

function toggleHelper() { // TODO - learn more about timing in JS
  iterateWorld(1);
}

function countNeighbours(x, y) {
  var neighbours = 0;
  neighbours = (cellArray[x-1][y-1] === "alive") ? neighbours+1 : neighbours; // top-left corner, clockwise
  neighbours = (cellArray[x][y-1] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x+1][y-1] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x+1][y] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x+1][y+1] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x][y+1] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x-1][y+1] === "alive") ? neighbours+1 : neighbours;
  neighbours = (cellArray[x-1][y] === "alive") ? neighbours+1 : neighbours;
  return neighbours;
}

function assignNextStatus(aliveNeighbours, ownStatus) {
  var nextStatus = "";
  if (ownStatus === "dead") {
    switch(aliveNeighbours) {
      case 0: nextStatus = "dead"; break;
      case 1: nextStatus = "dead"; break;
      case 2: nextStatus = "dead"; break;
      case 3: nextStatus = "alive"; break; // 1. tote Zelle mit = 3 Nachbarn wird leben
      case 4: nextStatus = "dead"; break;
      case 5: nextStatus = "dead"; break;
      case 6: nextStatus = "dead"; break;
      case 7: nextStatus = "dead"; break;
      case 8: nextStatus = "dead"; break;
      default: break;
    }
  } else if (ownStatus ==="alive") {
    switch(aliveNeighbours) {
      case 0: nextStatus = "dead"; break; // 2. lebende Zelle mit < 2 Nachbarn wird sterben
      case 1: nextStatus = "dead"; break;
      case 2: nextStatus = "alive"; break; // 3. lebende Zelle mit 2 oder 3 Nachbarn wird leben
      case 3: nextStatus = "alive"; break;
      case 4: nextStatus = "dead"; break; // 4. lebende Zelle mit 3 < Nachbarn wird sterben
      case 5: nextStatus = "dead"; break;
      case 6: nextStatus = "dead"; break;
      case 7: nextStatus = "dead"; break;
      case 8: nextStatus = "dead"; break;
      default: break;
    }
  }
  return nextStatus;
}

function createOctagon() {
  var octagonCoordinates = [           "005004",                     "008004",
                             "004005",           "006005", "007005",           "009005",
                                       "005006",                     "008006",
                                       "005007",                     "008007",
                             "004008",           "006008", "007008",           "009008",
                                       "005009",                     "008009" ];
  octagonCoordinates.forEach(function(coordinate) {
    document.getElementById(coordinate).setAttribute("style", "background-color:#82B346");
  });
  cellArray[5][4] = "alive"; // set status for iteration
  cellArray[8][4] = "alive";
  cellArray[4][5] = "alive";
  cellArray[6][5] = "alive";
  cellArray[7][5] = "alive";
  cellArray[9][5] = "alive";
  cellArray[5][6] = "alive";
  cellArray[8][6] = "alive";
  cellArray[5][7] = "alive";
  cellArray[8][7] = "alive";
  cellArray[4][8] = "alive";
  cellArray[6][8] = "alive";
  cellArray[7][8] = "alive";
  cellArray[9][8] = "alive";
  cellArray[5][9] = "alive";
  cellArray[8][9] = "alive";
}

function createBlinker() {
  var blinkerCoordinates = ["016007", "016008", "016009"];
  blinkerCoordinates.forEach(function(coordinate) {
    document.getElementById(coordinate).setAttribute("style", "background-color:#82B346");
  });
  cellArray[16][7] = "alive"; // set status for iteration
  cellArray[16][8] = "alive";
  cellArray[16][9] = "alive";
}

function createSegler() {
  var seglerCoordinates = [ "004014", "005014", "006014", "007014",
                            "003015", "007015",
                            "007016",
                            "003017", "006017" ];
  seglerCoordinates.forEach(function(coordinate) {
    document.getElementById(coordinate).setAttribute("style", "background-color:#82B346");
  });
  cellArray[4][14] = "alive";
  cellArray[5][14] = "alive";
  cellArray[6][14] = "alive";
  cellArray[7][14] = "alive";
  cellArray[3][15] = "alive";
  cellArray[7][15] = "alive";
  cellArray[7][16] = "alive";
  cellArray[3][17] = "alive";
  cellArray[6][17] = "alive";
}

function emphasizeCell(event) {
  //document.getElementById(event.currentTarget.id).setAttribute("style", "background-color:#FF0000");
}

function normalizeCell(event) {
  //document.getElementById(event.currentTarget.id).setAttribute("style", "background-color:#FFFFFF");
}

function indexToStr(x, y) {
  var indexString = "";
  var xString = "";
  var yString = "";
  switch(x.toString().length) {
        case 1:
          xString = "00" + x; break;
        case 2:
          xString = "0" + x; break;
        case 3:
          xString = x.toString(); break;
        default: break;
  }
  switch(y.toString().length) {
        case 1:
          yString = "00" + y; break;
        case 2:
          yString = "0" + y; break;
        case 3:
          yString = y.toString(); break;
        default: break;
  }
  indexString = xString + yString;
  return indexString;
}

function stringToIndex(string) {
  //TODO
}