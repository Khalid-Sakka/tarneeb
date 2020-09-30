let deck, players, player, T, turn, status, cut ;


function newGame(){
	deck = Card.createDeck();
	deck = Card.shuffle(deck);
	players = [];
	for(let i = 0; i < 4; i++){
		players[i] = new Player(i, !i);
	}
	players[0].partner(players[2]);
	players[1].partner(players[3]);
	player = players[0];
	turn = floor(random(4));
	status = "init";
	cut = false;
}

function runGame(){
	background(0,127,0);
	if(status == "init"){
		let pad = 0.8*width/52;
		p.html(pad);
		for(let i = 0; i < deck.length; i++){
			c = deck[i];
			c.x = 0.075*width + i*pad;
			c.y = height/2;
			c.show();
		}
		if(turn == 0){
			push();
			textSize(40*sc);
			textAlign(CENTER, CENTER);
			fill(200);
			text("cut!", width/2, height/4);
			pop();
		}else if(!cut){
			setTimeout(()=>{
				cutDeck(floor(random(52)));
				createP("cut");
			},500);
			cut = true;
		}
	}else if(status == "dealing"){
		
	}else if(status == "bidding"){
		
	}else if(status == "playing"){
		
	}
}

function handleClicks(){
	if(status == "init"){
		if(mouseY > height/2 - Card.h/2 && 
		mouseY < height/2 + Card.h/2){
			let index = floor(constrain(map(mouseX, 0, width, 0, 52),0,52));
			cutDeck(index);
		}
			
	}
}

function cutDeck(index){
	return;
}

class Player{
	
	constructor(num, human = false){
		this.num = num;
		this.isHuman = human;
		this.score = 0;
		this.teamMate = null;
		this.hand = [];
		this.loot = [];
	}
	
	partner(p){
		this.teamMate = p.num;
		p.teamMate = this.num;
	}
	
	dealCards(c){
		if(c instanceof Array){
			for(let card of c){
				this.hand.push(card);
			}
		}else if(c instanceof Card){
			this.hand.push(c);
		}
	}
	
}