let fr, sc;

function setup() {
	createCanvas(400, 400);
	fr = createP();
	sc = width/400;
	newGame();
}

function draw() {
	background(0);
	fr.html(frameRate());
}