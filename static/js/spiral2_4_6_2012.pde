/**
 
 * Valentina Camacho
 * Thesis - Zoom Out.me
 * Feb 28 2012
 
 * Based on:
 * PolarToCartesian
 * by Daniel Shiffman.  
 
 */

float r, rr;
float theta;
float a;



boolean calculateSpiral = true;

PImage spiralImage;


ArrayList<Pointer> spiral;
Pointer closest = null;
int currentI = 0;
int closestI = 0;
int hunchResults;

void setup() {
  size(400, 400);

  smooth();


  // Initialize all values
  r = 180;
  theta = 0;
  a = 0;

  spiral = new ArrayList<Pointer>();

  spiralImage = createImage(width, height, RGB);
  
  // pull from website's xml what that number is
  hunchResults = 4000;//instead of 4000 it should be the call from the API
  
  // whenever the user clicks on the spiral
  //changePage();
}

void draw() {
  
  
  //println(frameRate);

  if (calculateSpiral) {

    background(238,232,224);

    float factor = 2;
    float dtheta = 0.015*factor;

    for (int i = 0; i < hunchResults; i++) {
      // Convert polar to cartesian
      float x = rr * cos(theta);
      float y = rr * sin(theta);
      spiral.add(new Pointer(x, y));
      theta += dtheta;
      rr=constrain(r, 1, 1000);

      float rdiv = 1000/factor;
      r=r-r/rdiv;
    }

    // Translate the origin point to the center of the screen
    translate(width/2, height/2);
    for (Pointer p : spiral) {
      p.display();
    }

    // save it
    loadPixels();
    for (int i = 0; i < pixels.length; i++) {
      spiralImage.pixels[i] = pixels[i];
    } 
    updatePixels();
    spiralImage.updatePixels();

    calculateSpiral = false;
  } 
  else {

    image(spiralImage, 0, 0);
    translate(width/2, height/2);
    int i = 0;
    for (Pointer p : spiral) {
      float d = dist(p.loc.x+width/2, p.loc.y+height/2, mouseX, mouseY);
      if (d < 10) {
        fill(255, 0, 0);
        closestI = i;
       
      }
      i++;
    }
    
    
    
    currentI = int(lerp(currentI,closestI,0.1));
    
    Pointer closest = spiral.get(currentI);
    closest.drawInfo();

//    Pointer demo = spiral.get(closestI);
//     demo.drawInfo();

  }
  
  
}


// Browser/Client side javascript will call this function
// mouse position inside spiral
int getHunchRange() {
   return currentI;
}

int mapTheNumbers(float lowNum, float highNum) {

	hunchAdjustedNumber = map(getHunchRange(), 0, hunchResults,lowNum, highNum );
	return hunchAdjustedNumber;

}

class Pointer {

  PVector loc;

  //String name = "";
  //PImage img;

  color c;


  Pointer(float x, float y) {
    loc = new PVector(x, y);
    c = color(random(255), random(255), random(255));
  }

  void display() {
    fill(200);
    stroke(0,50);
    //ellipse(loc.x, loc.y, 6,6);
    line(loc.x, loc.y, 0,0);
//    line(loc.x,loc.y,5,5);
  }
  
  void drawInfo() {
    fill(c);
   ellipse(loc.x, loc.y, 18,18);
    //rect(loc.x,loc.y,100,100); 
    
  }
}


