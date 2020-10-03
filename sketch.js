let fr, p, debp, sc;

function setup() {
	let cnv = createCanvas(windowWidth, windowWidth);
	cnv.style("touch-action : null");
	fr = createP();
	p = createP("p");
	debp = createP();
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