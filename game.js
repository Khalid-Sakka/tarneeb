let deck, refCard, players, player, T, turn, lastTurn, status, cut, dealt, bids, bidSum ;


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
	lastTurn = turn;
	status = "init";
	cut = false;
	dealt = turn;
	bids = [];
}

function runGame(){
	debp.html(status);
	p.html(T);
	background(0,127,0);
	if(status == "init"){
		deck = Card.shuffle(deck);
		bids = [];
		bidSum = 0;
		let pad = 0.8*width/52;
		for(let i = 0; i < deck.length; i++){
			c = deck[i];
			c.x = 0.075*width + i*pad;
			c.y = height/2;
			c.show();
		}
		if(!cut && turn == (player.num+2)%4){
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
	}else if(status == "sorting"){
		showHands();
	}else if(status == "bidding"){
		let bid = players[turn].bid();
		bidSum += bid;
		turn = (turn + 1)%4;
		bids.push(bid);
		if(bids.length == 4 && bidSum >= 11){
			status = "playing";
			let s1 = bids.splice(0,4  -turn);
			bids = concat(bids,s1);
		}else if(bids.length == 4){
			status = "finishing";
		}
		showHands();
	}else if(status == "playing"){
		showHands();
	}else if(status = "finishing"){
		resetDeck();
		cut = false;
		turn = ++lastTurn;
		status = "init";
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
	createP(deck);
	if(index < deck.length){
		let p2 = deck.splice(index, deck.length - index);
		deck = concat(p2, deck);
		let s = deck[deck.length-1].suit;
		switch(s){
			case "h" :
			T = "d";
			break;
			case "s" :
			T = "c"
			break;
			case "d" :
			T = "h";
			break;
			case "c" :
			T = "s";
			break;
		}
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
			stack[0].reveal();
			players[dealt].dealCards(stack);
			dealt = (dealt+1)%4;
		}
	}else{
		let suits = "cdsh"
		setTimeout(()=>{
			for(let p of players){
				p.hand.sort((a,b)=>{
					if(suits.indexOf(a.suit) > suits.indexOf(b.suit)){
						return 1;
					}else if(suits.indexOf(a.suit) < suits.indexOf(b.suit)){
						return -1;
					}else if(vals.indexOf(a.val) > vals.indexOf(b.val)){
						return 1;
					}else{
						return -1;
					}
				});
				initHands();
				if(p != player){
					for(let card of p.hand){
						card.revealed = false;
					}
				}
			}
			status = "bidding";
		},1000);
		status = "sorting";
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
	let xPad = Card.w/1.75;
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

function resetDeck(){
	for(let p of players){
		let s1 = p.hand.splice(0,13);
		s1.map(a => a.revealed = false);
		deck = concat(deck, s1);
	}
}