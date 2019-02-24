var graphColors = ["red", "blue", "green", "orange", "purple"];
var connectorColor = "rgba(0,150,0,1)";
var armColor = "rgba(0,0,255,0.5)";

document.getElementById("xLoc").addEventListener("change", moveDot);
document.getElementById("yLoc").addEventListener("change", moveDot);
document.getElementById("radii").addEventListener("change", moveDot);
procGraphData();

function moveDot() {
    var myDot = document.getElementById("myDot");
    // console.table({myDot});

    var xLoc = document.getElementById("xLoc");
    var yLoc = document.getElementById("yLoc");
    // get x marker data
    var xRange = xLoc.max - xLoc.min;
    var xStep = 100 / xRange;
    // get y marker data
    var yRange = yLoc.max - yLoc.min;
    var yStep = 100 / yRange;

    xLoc = document.getElementById("xLoc").value;
    yLoc = document.getElementById("yLoc").value;
    var dotX = xLoc * xStep;
    var dotY = 100 - (yLoc * yStep);
    myDot.setAttribute("cx", `${dotX}%`);
    myDot.setAttribute("cy", `${dotY}%`);
    // console.table({myDot});
    connectDots(50, 50, dotX, dotY);
    drawRadii(50, 50, dotX, dotY, xStep, yStep);
}

function drawRadii(origX, origY, dotX, dotY, xStep, yStep) {
    var connectLen = Math.sqrt(Math.pow((dotX - origX), 2) + Math.pow((dotY - origY), 2))
    var line = document.getElementById("connectDots");
    var maxRadius = document.getElementById("maxRadius");
    var pythagC = document.getElementById("radii").value;
    var pythagB = connectLen / 2;
    var sin = (pythagB / pythagC);
    var asin = Math.asin(sin);
    var angle = asin * (180 / Math.PI);
    // console.table({connectLen, pythagC, pythagB, sin, angle});


    var findTangent1 = 90 - (Math.acos((dotX - origX) / connectLen) * (180 / Math.PI));
    var findTangent2 = (Math.acos((dotX - origX) / connectLen) * (180 / Math.PI)) - 90;
    // console.log({findTangent1, findTangent2});
    var armAngle1 = 0;
    if(dotY > 50) {
        armAngle1 = 180 - angle - findTangent1;
    } else {
        armAngle1 = findTangent1 - angle;
    }
    if(isNaN(armAngle1)) {
        armAngle1 = 0;
    } else {
        if(armAngle1 < 0) {
            armAngle1 += 360;
        }
    }



    // draw line from the orig to orig+pythagC then rotate based on sin/cos
    var radius1 = document.getElementById("radius1");
    var radius2 = document.getElementById("radius2");
    if(connectLen > pythagC*2) {
        armColor = "rgba(255,0,0,1)";
    } else {
        armColor = "rgba(0,255,0,1)";
    }
    line.setAttribute("style", `stroke:${armColor};stroke-width:4`);
    maxRadius.setAttribute("r", `${pythagC*2}%`);


    // find the end point of the first arm
    // x = r * cos(armAngle1)
    // y = r * sin(armAngle1)
    var armJoin = document.getElementById("armJoin");
    var secondArmX = Math.cos(armAngle1 / (180 / Math.PI)) * pythagC;
    var secondArmY = Math.sin(armAngle1 / (180 / Math.PI)) * pythagC;
    secondArmX += 50;
    secondArmY += 50;
    // added 50 to each since the location is based on percents and the origin is at 50 50
    
    

    if(!isNaN(angle)) {
        radius1.setAttribute("x1", `${origX}%`);
        radius1.setAttribute("y1", `${origY}%`);
        radius1.setAttribute("x2", `${(Number(origX) + Number(pythagC))}%`);
        radius1.setAttribute("y2", `${origY}%`);
        radius1.setAttribute("transform", `rotate(${armAngle1} 400,400)`);
        armJoin.setAttribute("cx", `${secondArmX}%`);
        armJoin.setAttribute("cy", `${secondArmY}%`);
        // console.log(radius1);
        radius2.setAttribute("x1", `${secondArmX}%`);
        radius2.setAttribute("y1", `${secondArmY}%`);
        radius2.setAttribute("x2", `${dotX}%`);
        radius2.setAttribute("y2", `${dotY}%`);
        // console.log(radius2);
        // radius2.setAttribute("transform", `rotate(${angle} ${Number(dotX)*xStep},${Number(dotY)*yStep})`);
        // console.log(radius2);
    } else {
        radius1.setAttribute("x1", `0%`);
        radius1.setAttribute("y1", `0%`);
        radius1.setAttribute("x2", `0%`);
        radius1.setAttribute("y2", `0%`);

        radius2.setAttribute("x1", `0%`);
        radius2.setAttribute("y1", `0%`);
        radius2.setAttribute("x2", `0%`);
        radius2.setAttribute("y2", `0%`);

        armJoin.setAttribute("cx", `-50`);
        armJoin.setAttribute("cy", `-50`);
    }
}

function connectDots(origX, origY, dotX, dotY) {
    var line = document.getElementById("connectDots");
    line.setAttribute("x1", `${origX}%`);
    line.setAttribute("y1", `${origY}%`);
    line.setAttribute("x2", `${dotX}%`);
    line.setAttribute("y2", `${dotY}%`);
}

function drawLine(x1, y1, x2, y2, color="black", width=2, graphType="") {
    var unit = (graphType == "bar-graph") ? "%" : "";
    var newLine = `<line x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" style="stroke:${color};stroke-width:${width+unit}"/>`;
    return newLine;
}

function drawPolyLine(myData, color="red", width=2) {
    // sadly, drawing the data with a poly line will not work since you cannot place poly points at percentages
    var points = "";
    for(var i = 0; i < myData["graph-data"].length; i++) {
        var yLoc = Number(myData["graph-data"][i][1]) - myData["y-range"][0];
        console.log(yLoc);
        var xLoc = Number(myData["graph-data"][i][0]) - myData["x-range"][0];
        console.log(xLoc);
        points += "" + xLoc + "%," + yLoc + "% ";
        console.log(points);
    }
    var newLine = `<polyline points='${points}' class='graph-stroke-${color} graph-stroke-width_${width} graph-no-fill'/>`;
    return newLine;
}

function procGraphData() {
    var graph = document.getElementById("myGraph");
    var htmlDataText = graph.innerHTML.trim();
    var myData = JSON.parse(htmlDataText);
    var graphHTML = '<svg class="graph-y_labels"></svg><svg class="graph">';
    console.log({graph, htmlDataText, myData, graphHTML});

    // draw graph
    // get x marker data
    var xRange = myData["x-range"][1] - myData["x-range"][0];
    var xStep = 100 / xRange;
    // get y marker data
    var yRange = myData["y-range"][1] - myData["y-range"][0];
    var yStep = 100 / yRange;


    graphHTML = drawGraphLines(myData, graphHTML, xRange, xStep, yRange, yStep);
    var xLoc = document.getElementById("xLoc").value;
    var yLoc = document.getElementById("yLoc").value;
    var dotX = xLoc * xStep;
    var dotY = 100 - (yLoc * yStep);
    // console.table({xLoc, dotX, yLoc, dotY});
    graphHTML += `<circle id='maxRadius' cx='50%' cy='50%' r='0' stroke='red' stroke-width='3' fill='none'/>`;
    graphHTML += `<circle id='indexDot' cx='50%' cy='50%' r='10' stroke='black' stroke-width='3' fill='rgba(0, 255, 0, 1)'/>`;
    graphHTML += `<circle id='myDot' cx='${dotX}%' cy='${dotY}%' r='10' stroke='black' stroke-width='3' fill='rgba(255, 0, 0, 1)'/>`;
    graphHTML += `<circle id='armJoin' cx='-50' cy='-50' r='10' stroke='black' stroke-width='0' fill='rgba(0, 0, 255, 0.5)'/>`;
    graphHTML += `<line id='connectDots' x1="50%" y1="50%" x2="${dotX}%" y2="${dotY}%" style="stroke:${connectorColor};stroke-width:4"/>`;
    graphHTML += `<line id='radius1' x1="50%" y1="50%" x2="50%" y2="50%" style="stroke:${armColor};stroke-width:4"/>`;
    graphHTML += `<line id='radius2' x1="50%" y1="50%" x2="50%" y2="50%" style="stroke:${armColor};stroke-width:4"/>`;
    graphHTML += '</svg><svg class="graph-x_labels"></svg>';
    graph.innerHTML = graphHTML;
    drawGraphLabels(myData);
}

function drawGraphLabels(myData) {
    
    // draw x & y labels
    // these should have their own section outside of the graph
    
    var xLabel = myData["xLabel"];
    var yLabel = myData["yLabel"];

    var currentGraph = document.getElementById("myGraph");

    var xLabelEle = currentGraph.getElementsByClassName("graph-x_labels")[0];
    var yLabelEle = currentGraph.getElementsByClassName("graph-y_labels")[0];
    xLabelEle.innerHTML = '<text x="50%" y="80%" class="graph-text">' + xLabel + '</text>';
    yLabelEle.innerHTML = '<text x="0" y="50%" class="graph-text">' + yLabel + '</text>';
}

function drawGraphLines(myData, graphHTML, xRange, xStep, yRange, yStep) {
    // draw x & y baselines
    graphHTML += drawLine(0, 0, 0, 100);
    graphHTML += drawLine(0, 100, 100, 100);

    // draw x markers
    // these need to be in the same section with the label
    for(var i = 1; i < xRange; i++) {
        if(i % myData["x-range"][2] == 0) {
            var newX = xStep*i;
            graphHTML += drawLine(newX, 100, newX, 0, "gray");
        }
    }

    // draw y markers
    // these need to be in the same section with the labels
    for(var i = 1; i < yRange; i++) {
        if(i % myData["y-range"][2] == 0) {
            var newY = 100-(yStep*i);
            graphHTML += drawLine(0, newY, 100, newY, "gray");
        }
    }
    return graphHTML;
}