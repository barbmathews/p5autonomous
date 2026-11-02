let particles = []
let num = 80
let scaleValue = 0.004   // how zoomed in the noise is
let speed = 5

let paper = '#73cd2a'
let ink = '#14161F'
let colors = ['#EAF2EF', '#912F56', '#521945', '#361F27','#0D090A','#4D9DE0', '#E15554', '#E1BC29', '#3BB273','#7768AE']

let word = "i feel like moving"
let letters = []

function setup() {
  createCanvas(windowWidth, 600)
  background(paper)
  stroke(random(colors))
  for (let i = 0; i < num; i++) {
    particles.push(makeParticle())
  }
  textFont('monospace')
  textSize(44)
  // textAlign(CENTER, CENTER)
  textAlign(30, 550)
  makeLetters()
}

function makeLetters() {
  letters = []
  let spacing = 30
  let startX = width / 2 - (word.length - 1) * spacing / 2
  for (let i = 0; i < word.length; i++) {
    letters.push({
      char: word[i],
      homeX: startX + i * spacing,
      homeY: height / 2,
      dx: 0,             // how far it has drifted from home
      dy: 0,
      angle: 0,
      seed: random(1000)
    })
  }
}

function makeParticle() {
  // random(1) cubed: most sizes come out small, a few come out huge
  let size = 3 + pow(random(1), 30) * 60
  let life = random(80, 260)
  return {
    // x: width+4,
    x: width/2,
    y: height/2,
    size: size,
    life: life,
    maxLife: life,
    steps: 0,
    c: random(colors)
  }
}

function draw() {

  stroke(0.5)
  fill('#0D090A')
  textSize(24)
  text("'s' to capture your random image", 30, 550)
   
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i]

    // noise (0 to 1) becomes an angle (0 to two full turns)
    let n = noise(p.x * scaleValue, p.y * scaleValue)
    let angle = n * TWO_PI * 2
    p.x += cos(angle) * speed + random(-10, 2)
    p.y += sin(angle) * speed + random(-5, 7)
    p.life -= 1
    p.steps += 1

    // 0 at birth, 1 in the middle of its life, 0 at death
    let age = 1 - p.life / p.maxLife
    let d = p.size * sin(age * PI) + random(-5,5)

    fill(p.c) 
    // stroke(p.c)
    // noFill()
    circle(p.x, p.y, d)
    triangle(p.x, p.y, p.x, p.y, d)
    rect(p.x, p.y, p.x, p.y)

    // die when old or off the canvas, then start again
    let offCanvas = p.x < 0 || p.x > width || p.y < 0 || p.y > height
    if (p.life <= 0 || offCanvas) {
      particles[i] = makeParticle()
    }
  }

  let t = frameCount * 0.3

  for (let i = 0; i < letters.length; i++) {
    let l = letters[i]
    let d = dist(mouseX, mouseY, l.homeX, l.homeY)

    if (d < 120) {
      // near the mouse: drift on noise, and get pushed away a little
      l.dx += map(noise(l.seed, t), 0, 1, -4, 4)
      l.dy += map(noise(l.seed + 500, t), 0, 1, -4, 4)
      l.angle += map(noise(l.seed + 900, t), 0, 1, -0.1, 0.1)
      let away = atan2(l.homeY - mouseY, l.homeX - mouseX)
      l.dx += cos(away) * 1.5
      l.dy += sin(away) * 1.5
      // don't let it fly off forever
      l.dx = constrain(l.dx, -180, 180)
      l.dy = constrain(l.dy, -180, 180)
    } else {
      // far away: ease back home (keep 94% of the drift each frame)
      l.dx *= 0.94
      l.dy *= 0.94
      l.angle *= 0.94
    }

    // the farther from home, the more it fades toward coral
    let far = constrain(dist(0, 0, l.dx, l.dy) / 200, 0, 1)
    fill(lerpColor(color('#f41ce2'), color('#ff8b06'), far))
    noStroke()

    push()
    translate(l.homeX + l.dx, l.homeY + l.dy)
    rotate(l.angle)
    text(l.char, 0, 0)
    pop()
  }

}

// click: a new noise landscape on a clean sheet
function mousePressed() {
//   noiseSeed(random(10000))
noiseSeed(300)
  background(fill(random(colors)))
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('my-flow-field', 'png')
  }

  if (key === 'Backspace') {
    word = word.slice(0, -1)
  } else if (key.length === 1) {
    word = word + key
  }
  makeLetters()
}










// let walkers = [];

// function setup() {
//   createCanvas(windowWidth, 600);
//   // Create multiple walkers when setting up
//   for (let i = 0; i < 1; i++) {
//     walkers.push({
//       x: random(width), // use width/2 for starting in the center
//       y: random(height),// use height/2 for starting in the center
//       color: color(random(255), random(255), random(255)),
//       s: random(8, 20)
//     });
//   }
// }

// function draw() {
//   // background(220, 10) //for a motion-trail effect
  
//   for (let i = 0; i < walkers.length; i++) {
//     let w = walkers[i];
    
//     // Pick a random step (-1, 0, or 1) for X and Y
//     w.x += floor(random(-1, 2));
//     w.y += floor(random(-1, 2));

//     w.s *= 0.999
    
//     // Draw the walker
//     fill(w.color);
//     stroke(w.color);
//     circle(w.x, w.y, w.s);
//   }

//   walkers = walkers.filter(walker => isInsideCanvs(walker)) // remove walkers that are not on canvas
//   walkers = walkers.filter(walker => walker.s > 0.1) // remove small walkers
// }

// function mousePressed() {
// //   add 10 more random walkers
// //   for (let i = 0; i < 10; i++) {
// //     walkers.push({
// //       x: random(width), // use width/2 for starting in the center
// //       y: random(height),// use height/2 for starting in the center
// //       color: color(random(255), random(255), random(255)),
// //       s: random(20, 60)
// //     });
// //   }

//   walkers.push({
//     x: mouseX, // use width/2 for starting in the center
//     y: mouseY,// use height/2 for starting in the center
//     color: color(random(255), random(255), random(255)),
//     s: random(8, 20)
//   })
// }

// function isInsideCanvs(walker) {
//   return walker.x > 0 && walker.x <= width && walker.y > 0 && walker.y <= height
// }


// let xScale = 0.015;
// let yScale = 0.02;

// let gapSlider;
// let gap;
// let offsetSlider;
// let offset;

// function setup() {
//   createCanvas(600, 600);
//   // noLoop()

// //     // Set up the sliders
// //   gapSlider = createSlider(2, width / 10, width / 20);
// //   gapSlider.changed(dotGrid);
// //   gapSlider.mouseMoved(checkChanged);
// //   offsetSlider = createSlider(0, 1000, 0);
// //   offsetSlider.mouseMoved(checkChanged);

// //   // Draw the grid
// //   dotGrid();
// //     // When the mouse is moved over a slider
// //     // Draw the dot grid if something has changed
// }

// function checkChanged() {
//   if (gap !== gapSlider.value()) {
//     dotGrid();
//   }
//   if (offset !== offsetSlider.value()) {
//     dotGrid();
//   }
// }

// function dotGrid() {
//   background(255);
//   noStroke();
//   fill(0);

//   // Get the current gap and offset values from the sliders
//   gap = gapSlider.value();
//   offset = offsetSlider.value();

//   // Loop through x and y coordinates, at increments set by gap
//   for (let x = gap / 2; x < width; x += gap) {
//     for (let y = gap / 2; y < height; y += gap) {
//       // Calculate noise value using scaled and offset coordinates
//       let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

//       // Since noiseValue will be 0-1, multiply it by gap to set diameter to
//       // between 0 and the size of the gap between circles
//       let diameter = noiseValue * gap;
//       circle(x, y, diameter);
//     }
//   }
// }


// function draw() {
//   background(220);
//   for(let i = 0; i < width; i+=10) {
//     for(let j = 0; j < height; j+=10) {
//       stroke(random(255))
//       let n = noise((i+1000)*0.001, j*0.19, frameCount*0.9) // remove frameCount to remove animation
//       let c = map(n, 0, 1, 0, 255)
//       noFill()
//       // fill(random(255)) fill using random
//       square(i,j, 10)
//       triangle(i,j,10,-30, 36, 25)
      
//     }
//   } 
// }