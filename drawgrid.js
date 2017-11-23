/*
 * This is the funciton to implement to make your own abstract design.
 *
 * arguments:
 * p5: the p5.js object - all draw commands should be prefixed with this object
 * x1, x2, y1, y2: draw the pattern contained in the rectangle x1,y1 to x2, y2
 * z: use this as the noise z offset (can be shifted)
 * zoom: current zoom level (starts at 0), useful to decide how much detail to draw
 *
 * The destination drawing should be in the square 0, 0, 255, 255.
 */
var max_movement = 70;
var line_width = 3;
var grid_size = 80;
var arc_width = 80;
var dot_width = 15;
var midCloud_size = 0.3;
var cCur_size = 0.2;
var small_arcWidth = 5;

/* the random number seed for the tour */
var tourSeed = 250;
/* triplets of locations: zoom, x, y */
var tourPath = [
  [6, 490.148437500000, 491.312500000000],
  [5, 415.171875000000, 506.593750000000],
  [4, 410.343750000000, 491.937500000000],
  [3, 381.062500000000, 523.625000000000],
  [2, 390.375000000000, 517.750000000000],
  [1, 351.250000000000, 506.000000000000],
  [0, 334.500000000000, 542.000000000000]
]

var initialZoomLevel = 6;
var maxZoomLevel = 10;

function getOffsetPoint(p5, x, y, z, noiseScale) {
  var noiseX = p5.noise(x * noiseScale,
                        y * noiseScale, z);
  var noiseY = p5.noise(x * noiseScale,
                        y * noiseScale, z+50);
  var offsetX = p5.map(noiseX, 0, 1, -max_movement, max_movement);
  var offsetY = p5.map(noiseY, 0, 1, -max_movement, max_movement);
  return [x+offsetX, y+offsetY]
}

function getNoiseValue (p5, x, y, z, noiseScale) {
  var noiseVal = p5.noise(x * noiseScale, y * noiseScale, z);
  return (noiseVal);
}

function snap_to_grid(num, gsize) {
  return (num - (num % gsize));
}

function middleClouds (p5, x, y, midCloud_scale) {
  p5.push();
  p5.translate(x, y);
  p5.stroke(255, 255, 255);
  p5.strokeJoin(p5.ROUND);
  p5.strokeWeight(1);
  p5.fill(255, 255, 255, 200);

  p5.beginShape();
  p5.vertex(0, 0);
  p5.bezierVertex(3*midCloud_scale, 2*midCloud_scale, 7*midCloud_scale, 2*midCloud_scale, 10*midCloud_scale, 0);

  p5.vertex(10*midCloud_scale, 0);
  p5.bezierVertex(10*midCloud_scale, -3*midCloud_scale, 12*midCloud_scale, -6*midCloud_scale, 15*midCloud_scale, -4*midCloud_scale);

  p5.vertex(15*midCloud_scale, -4*midCloud_scale);
  p5.bezierVertex(19*midCloud_scale, 0, 15*midCloud_scale, 4*midCloud_scale, 12.5*midCloud_scale, 2*midCloud_scale);

  p5.vertex(12.5*midCloud_scale, 2*midCloud_scale);
  p5.bezierVertex(17*midCloud_scale, 5*midCloud_scale, 21*midCloud_scale, -1*midCloud_scale, 18*midCloud_scale, -6*midCloud_scale);

  p5.vertex(18*midCloud_scale, -6*midCloud_scale);
  p5.bezierVertex(20*midCloud_scale, -7*midCloud_scale, 21*midCloud_scale, -7*midCloud_scale, 23*midCloud_scale, -5*midCloud_scale);

  p5.vertex(23*midCloud_scale, -5*midCloud_scale);
  p5.bezierVertex(28*midCloud_scale, -5*midCloud_scale, 29*midCloud_scale, -5*midCloud_scale, 30*midCloud_scale, 0);

  p5.vertex(30*midCloud_scale, 0);
  p5.bezierVertex(34*midCloud_scale, -2*midCloud_scale, 36*midCloud_scale, 6*midCloud_scale, 40*midCloud_scale, 4*midCloud_scale);

  p5.vertex(40*midCloud_scale, 4*midCloud_scale);
  p5.bezierVertex(37*midCloud_scale, 6*midCloud_scale, 35*midCloud_scale, 7*midCloud_scale, 32*midCloud_scale, 6*midCloud_scale);

  p5.vertex(32*midCloud_scale, 6*midCloud_scale);
  p5.bezierVertex(32*midCloud_scale, 6*midCloud_scale, 33*midCloud_scale, 12*midCloud_scale, 26*midCloud_scale, 12*midCloud_scale);

  p5.vertex(26*midCloud_scale, 12*midCloud_scale);
  p5.bezierVertex(20*midCloud_scale, 10*midCloud_scale, 23*midCloud_scale, 2*midCloud_scale, 27*midCloud_scale, 5*midCloud_scale);

  p5.vertex(27*midCloud_scale, 5*midCloud_scale);
  p5.bezierVertex(23*midCloud_scale, 0, 17*midCloud_scale, 7*midCloud_scale, 20*midCloud_scale, 11*midCloud_scale);

  p5.vertex(20*midCloud_scale, 11*midCloud_scale);
  p5.bezierVertex(13*midCloud_scale, 13*midCloud_scale, 11*midCloud_scale, 8*midCloud_scale, 9*midCloud_scale, 6*midCloud_scale);

  p5.vertex(9*midCloud_scale, 6*midCloud_scale);
  p5.bezierVertex(3*midCloud_scale, 5*midCloud_scale, 3*midCloud_scale, 4*midCloud_scale, 0, 0);

  p5.endShape();
  p5.pop();
}

function cloudCurve (p5, x, y, cCurve_scale) {
	p5.push();
  p5.translate(x, y);
  p5.noFill();
	p5.stroke(255, 255, 255);
	p5.strokeJoin(p5.ROUND);
	p5.strokeWeight(2);
	
	p5.beginShape();
	p5.vertex(0, 0);
	p5.bezierVertex(7 * cCurve_scale, -8 * cCurve_scale, 8* cCurve_scale, -3* cCurve_scale, 10 * cCurve_scale, -3 * cCurve_scale);
	p5.endShape();
	 
	p5.beginShape();	
	p5.vertex(0, 0);
	p5.bezierVertex(10 * cCurve_scale, -7 * cCurve_scale, 10 * cCurve_scale, 7 * cCurve_scale, 20 * cCurve_scale, 0);
	
	p5.vertex(20 * cCurve_scale, 0);
	p5.bezierVertex(25 * cCurve_scale, -5 * cCurve_scale, 20 * cCurve_scale, -10 * cCurve_scale, 17 * cCurve_scale, -10 * cCurve_scale);
	
	p5.vertex(17 * cCurve_scale, -10 * cCurve_scale);
	p5.bezierVertex(10 * cCurve_scale, -11 * cCurve_scale, 9 * cCurve_scale, 0, 17 * cCurve_scale, -1 * cCurve_scale);
	
	p5.vertex(17 * cCurve_scale, -1 * cCurve_scale);
	p5.bezierVertex(23 * cCurve_scale, -3 * cCurve_scale, 19 * cCurve_scale, -10 * cCurve_scale, 15 * cCurve_scale, -7 * cCurve_scale);
	
	p5.vertex(15 * cCurve_scale, -7 * cCurve_scale);
	p5.bezierVertex(12 * cCurve_scale, -4 * cCurve_scale, 16 * cCurve_scale, -2 * cCurve_scale, 17 * cCurve_scale, -4 * cCurve_scale);	
	p5.endShape();	
	p5.pop();
}

/*
 * This is the funciton to implement to make your own abstract design.
 *
 * arguments:
 * p5: the p5.js object - all draw commands should be prefixed with this object
 * x1, x2, y1, y2: draw the pattern contained in the rectangle x1,y1 to x2, y2
 * z: use this as the noise z offset (can be shifted)
 * zoom: current zoom level (starts at 0), useful to decide how much detail to draw
 *
 * The destination drawing should be in the square 0, 0, 255, 255.
 */
function drawGrid(p5, x1, x2, y1, y2, z, zoom) {
  // debug - show border
  var max_shift = max_movement;
  var min_x = snap_to_grid(x1 - max_shift, grid_size);
  var max_x = snap_to_grid(x2 + max_shift + grid_size, grid_size);
  var min_y = snap_to_grid(y1 - max_shift, grid_size);
  var max_y = snap_to_grid(y2 + max_shift + grid_size, grid_size);


  var c_p00 = p5.map(0, x1, x2, 0, 256);
  var c_plwidth = p5.map(line_width, x1, x2, 0, 256);
  var cur_line_width = c_plwidth - c_p00;
  var c_arcWidth = p5.map(arc_width, x1, x2, 0, 256);
  var cur_acrWidth = c_arcWidth - c_p00;
  var c_dotWidth = p5.map(dot_width, x1, x2, 0, 256);
  var cur_dotWidth = c_dotWidth - c_p00;
  var c_midCloudSize = p5.map(midCloud_size, x1, x2, 0, 256);
  var cur_midCloudSize = c_midCloudSize - c_p00;
  var c_cCurSize = p5.map(cCur_size, x1, x2, 0, 256);
  var cur_cCurSize = c_cCurSize - c_p00;
  var c_smallArc = p5.map(small_arcWidth, x1, x2, 0, 256);
  var cur_smallArc = c_smallArc - c_p00;

  // draw noise background
  for(var i=0; i<16; i++) {
    var n_x = p5.map(i, 0, 16, x1, x2);
    for(var j=0; j<16; j++) {
      var n_y = p5.map(j, 0, 16, y1, y2);
      var noiseVal = getNoiseValue(p5, n_x, n_y, z, 0.01);
      p5.push();
      p5.noiseDetail(8, 0.5);
      p5.noStroke();
      p5.fill(noiseVal*255, 128, 153);
      p5.rect(i*16, j*16, 16, 16);
      p5.pop();
    }
  }

  //draw point background
  if (zoom >= 5) {
    for (var i=0; i<16; i+=10) {
      var n_pointX = p5.map(i, 0, 16, x1, x2);
      for (var j=0; j<16; j+=5) {
        var n_pointY = p5.map(j, 0, 16, y1, y2);
        var noiseVal = getNoiseValue(p5, n_pointX, n_pointY, z, 0.1);
        p5.push();
        p5.noiseDetail(8, 0.55);
        p5.stroke(255, 255, 153);
        p5.strokeWeight(p5.random(1,2));
        p5.point(i*p5.random(1, 20), j*p5.random(10, 20));
        p5.pop();
      }
    }
  }

  p5.noiseDetail(8, 0.55);
  for(var x=min_x; x<max_x; x+=grid_size) {
    for(var y=min_y; y<max_y; y+=grid_size) {
      var shift_point = getOffsetPoint(p5, x, y, z, 0.5);
      var x_pos = p5.map(shift_point[0], x1, x2, 0, 256);
      var y_pos = p5.map(shift_point[1], y1, y2, 0, 256);

      p5.push(); //lines 
      var n_line = getNoiseValue(p5, x, y, z, 0.4);
      p5.stroke(255, 255, 255, 200 * n_line);
      p5.strokeWeight(cur_line_width * n_line);
      var shift_point2 = getOffsetPoint(p5, x, y+grid_size, z, 0.5);
      var x_pos2 = p5.map(shift_point2[0], x1, x2, 0, 256);
      var y_pos2 = p5.map(shift_point2[1], y1, y2, 0, 256);
      p5.line(x_pos, y_pos, x_pos2, y_pos2);
      p5.pop();

      p5.push(); //arc leaf
      var n_leafColor = getNoiseValue(p5, x, y, z, 0.006);
      p5.stroke(255);
      p5.strokeWeight(0.8);
      if (n_leafColor < 0.33) {
        p5.fill(153 * n_leafColor, 255, 153 * n_leafColor, 150); //green
      }
      else if (n_leafColor < 0.66 && n_leafColor >= 0.33) {        
        p5.fill(255, 100 * n_leafColor, 200 * n_leafColor, 150); //red
      }
      else {
        p5.fill(128 * n_leafColor, 229 * n_leafColor, 255, 150); //blue
      }      
      var noiseWidth = getNoiseValue(p5, x, y, z, 0.01);
      var noiseRotate = getNoiseValue(p5, x, y, z, 0.03);      
      p5.arc(x_pos, y_pos, cur_acrWidth * noiseWidth, cur_acrWidth * noiseWidth, (-p5.PI-p5.HALF_PI) * noiseRotate, (-p5.QUARTER_PI) * noiseRotate, p5.PIE);
      p5.arc(x_pos, y_pos, cur_acrWidth * noiseWidth, cur_acrWidth * noiseWidth, (-p5.PI-p5.QUARTER_PI) * noiseRotate, (-p5.QUARTER_PI-p5.QUARTER_PI) * noiseRotate, p5.PIE);
      p5.arc(x_pos, y_pos, cur_acrWidth * noiseWidth, cur_acrWidth * noiseWidth, (-p5.PI) * noiseRotate, (-p5.QUARTER_PI-p5.QUARTER_PI-p5.QUARTER_PI) * noiseRotate, p5.PIE);
      p5.pop();

      //draw ellipse
      if (zoom >= 3) {
        p5.push();
        var shift_point3 = getOffsetPoint(p5, x + grid_size, y, z, 0.06);
        var x_pos3 = p5.map(shift_point3[0], x1, x2, 0, 256);
        var y_pos3 = p5.map(shift_point3[1], y1, y2, 0, 256);
        var n_dotWidth = getNoiseValue(p5, x, y, z, 0.009);
        p5.noStroke();
        p5.fill(255, 255, 153, 200);
        p5.ellipse(x_pos3, y_pos3, cur_dotWidth * n_dotWidth);
        p5.pop();
      }

      //draw clouds
      if (zoom >= 4) {
        p5.push();
        middleClouds(p5, x_pos3, y_pos3, cur_midCloudSize * n_dotWidth);
        middleClouds(p5, x_pos3+(cur_midCloudSize*10), y_pos3+(cur_midCloudSize*7), -cur_midCloudSize * n_dotWidth);
        middleClouds(p5, x_pos3+(cur_midCloudSize*8), y_pos3+(cur_midCloudSize*5), cur_midCloudSize * n_dotWidth);
        middleClouds(p5, x_pos3+(cur_midCloudSize*2), y_pos3+(cur_midCloudSize*13), -cur_midCloudSize * n_dotWidth);
        middleClouds(p5, x_pos3+(cur_midCloudSize*-3), y_pos3+(cur_midCloudSize*10), cur_midCloudSize*1.2 * n_dotWidth);        
        p5.pop();

        //draw clouds curves
        if (zoom >= 5) {
          p5.push();
          cloudCurve(p5, x_pos3+(cur_cCurSize*18), y_pos3, cur_cCurSize*1.3 * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*3), y_pos3+(cur_cCurSize*-1), -cur_cCurSize * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*-10), y_pos3+(cur_cCurSize*13), cur_cCurSize * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*40), y_pos3+(cur_cCurSize*12), -cur_cCurSize * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*35), y_pos3+(cur_cCurSize*7), -cur_cCurSize/2 * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*5), y_pos3+(cur_cCurSize*8), cur_cCurSize * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*17), y_pos3+(cur_cCurSize*22), cur_cCurSize/1.2 * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*5), y_pos3+(cur_cCurSize*20), -cur_cCurSize/1.3 * n_dotWidth);
          cloudCurve(p5, x_pos3+(cur_cCurSize*-27), y_pos3+(cur_cCurSize*13), cur_cCurSize * n_dotWidth);
          p5.pop();
        }
      }

      //draw small arc
      if (zoom >= 6) {
        p5.push();
        p5.stroke(255);
        p5.strokeWeight(0.8);
        n_arcRotate = getNoiseValue(p5, x, y, z, 0.3);
        if (n_leafColor < 0.33) {
          p5.fill(153 * n_leafColor, 255, 153 * n_leafColor, 150); //green
        }
        else if (n_leafColor <= 0.66 && n_leafColor >= 0.33) {        
          p5.fill(255, 100 * n_leafColor, 200 * n_leafColor, 150); //red
        }
        else {
          p5.fill(128 * n_leafColor, 229 * n_leafColor, 255, 150); //blue
        }            
        p5.arc(x_pos3+(cur_smallArc*1.1), y_pos3+(cur_smallArc*-0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI-p5.HALF_PI) * noiseRotate, (-p5.QUARTER_PI) * noiseRotate, p5.PIE);
        p5.arc(x_pos3+(cur_smallArc*1.1), y_pos3+(cur_smallArc*-0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI-p5.QUARTER_PI) * noiseRotate, (-p5.QUARTER_PI-p5.QUARTER_PI) * noiseRotate, p5.PIE);
        p5.arc(x_pos3+(cur_smallArc*1.1), y_pos3+(cur_smallArc*-0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI) * noiseRotate, (-p5.QUARTER_PI-p5.QUARTER_PI-p5.QUARTER_PI) * noiseRotate, p5.PIE);

        p5.arc(x_pos3+(cur_smallArc*-1.3), y_pos3+(cur_smallArc*0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI-p5.HALF_PI) * n_arcRotate, (-p5.QUARTER_PI) * n_arcRotate, p5.PIE);
        p5.arc(x_pos3+(cur_smallArc*-1.3), y_pos3+(cur_smallArc*0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI-p5.QUARTER_PI) * n_arcRotate, (-p5.QUARTER_PI-p5.QUARTER_PI) * n_arcRotate, p5.PIE);
        p5.arc(x_pos3+(cur_smallArc*-1.3), y_pos3+(cur_smallArc*0.5), cur_smallArc * n_dotWidth, cur_smallArc * n_dotWidth, (-p5.PI) * n_arcRotate, (-p5.QUARTER_PI-p5.QUARTER_PI-p5.QUARTER_PI) * n_arcRotate, p5.PIE);
        p5.pop();
      }
    }
  }
}
