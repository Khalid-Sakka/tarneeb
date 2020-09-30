let fr, p, sc;

function setup() {
	createCanvas(400, 400);
	fr = createP();
	p = createP("hello");
	sc = width/400;
	newGame();
}

function draw() {
	background(0);
	fr.html(frameRate());
	runGame();
}

function mouseClicked(){
	handleClicks();
}