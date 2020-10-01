let deck, refCard, players, player, T, turn, status, cut, dealt ;


function newGame(){
	deck = Card.createDeck();
	deck = Card.shuffle(deck);
	refCard = new Card(-1, -1);
	refCard.x = width/2;
	refCard.y = height/2;
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
	dealt = turn;
}

function runGame(){
	debp.html(status);
	background(0,127,0);
	if(status == "init"){
		let pad = 0.8*width/52;
		for(let i = 0; i < deck.length; i++){
			c = deck[i];
			c.x = 0.075*width + i*pad;
			c.y = height/2;
			c.show();
		}
		if(turn == (player.num+2)%4){
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
		if(deck.length > 0){
			refCard.show();
		}
		if(frameCount % 8 ==0){
			deal();
		}
		showHands();
	}else if(status == "bidding"){
		showHands();
	}else if(status == "playing"){
		showHands();
	}else if(status = "finishing"){
		
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
	if(index < deck.length){
		let p2 = deck.splice(index, deck.length - index);
		deck = concat(p2, deck);
		status = "dealing";
	}
}

function deal(){
	if(deck.length > 0){
		if(deck.length > 4){
			let stack = deck.splice(0,3);
			players[dealt].dealCards(stack);
			dealt = (dealt+1)%4;
		}else{
			let stack = deck.splice(0,1);
			players[dealt].dealCards(stack);
			dealt = (dealt+1)%4;
		}
	}else{
		status = "bidding";
	}
	initHands();
}

function showHands(){
	for(let p of players){
		for(let c of p.hand){
			c.show();
		}
	}
}

function initHands(){
	let xPad = Card.w/2;
	let yPad = Card.h/3;
	for(let pl of players){
		let plx = pl.num%2 === 0? width/6 : undefined;
		let ply = pl.num%2 === 1? height/5 : undefined;
		for(let i = 0; i < pl.hand.length; i++){
			c = pl.hand[i];
			if(pl == player){
				c.reveal();
			}
			if(pl.num%2 == 0){
				ply = pl.num == 0? height - Card.h/2 : Card.h/2;
				c.x = plx + i * xPad;
				c.y = ply;
			}else{
				plx = pl.num == 1? width - Card.w/2 : Card.w/2;
				c.x = plx;
				c.y = ply + i * yPad;
			}
		}
	}
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