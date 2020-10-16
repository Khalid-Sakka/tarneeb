let deck, refCard, slots, players, player, T, turn, start, 
lastTurn, status, cut, dealt, bids, roundOver ;


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
	start = turn;
	lastTurn = turn;
	status = "init";
	cut = false;
	dealt = turn;
	bids = [];
	slots = [
		{card:null, x : width/2, y: height-2*Card.h, id : 0},
		{card:null, x : width-2.5*Card.w, y : height/2, id : 1},
		{card:null, x : width/2, y : 2*Card.h, id : 2},
		{card:null, x:2.5*Card.w, y : height/2, id : 3}
	];
}

function runGame(){
	debp.html(status);
	p.html(bids);
	background(0,127,0);
	if(status == "init"){
		deck = Card.shuffle(deck);
		lastTurn = turn;
		bids = [];
		bidSum = 0;
		roundOver = false;
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
			},500);
			cut = true;
		}
		players.map(x =>{
			x.hasBid = false;
			return x;
		});
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
		showHands();
		if(players[turn] != player && !players[turn].hasBid){
			let bid = players[turn].bid();
			bids.push(bid);
			players[turn].hasBid = true; 
			turn = (turn + 1)%4;
		}else if(players[turn] == player){
			showBids();
		}
		let bidSum = bids.length < 4? 0: bids.reduce((a,b)=> a+b);
		if(bids.length == 4 && bidSum >= 11){
			status = "playing";
			let s1 = bids.splice(0,4  -turn);
			bids = concat(bids,s1);
		}else if(bids.length == 4){
			status = "finishing";
		}
	}else if(status == "playing"){
		showHands();
		showSlots();
		ply(turn);
	}else if(status = "finishing"){
		resetDeck();
		cut = false;
		turn = (lastTurn+1)%4;
		status = "init";
	}
}
/****************************************/
function ply(n){
	if(!roundOver){
		if(players[n] == player){
			turn = (turn+1)%4;
		}else{
			if(!players[n].hasPlayed){
				setTimeout(()=>{
					players[n].play("h");
					turn = (turn+1)%4;
					players[n].hasPlayed = false;
				}, 200);
				players[n].hasPlayed = true;
			}
		}
	}else{
		status = "finishing";
	}
}
/****************************************/

function handleClicks(){
	if(status == "init"){
		if(mouseY > height/2 - Card.h/2 && 
		mouseY < height/2 + Card.h/2){
			let index = floor(constrain(map(mouseX, 0, width, 0, 52),0,52));
			cutDeck(index);
		}
	}else if(status == "bidding"){
		if(players[turn] == player && !player.hasBid){
			let result;
			if(mouseY > 125*sc && mouseY < 165*sc){
				if(mouseX > sc*80 && mouseX < sc*120 && player.score < 30){
					result = 2
				}else if(mouseX > sc*130 && mouseX < sc*170&&player.score < 40){
					result = 3
				}else if(mouseX > sc* 180 && mouseX < sc*220){
					result = 4
				}else if(mouseX > sc* 230 && mouseX < sc* 270){
					result = 5
				}else if(mouseX > sc* 280 && mouseX < sc* 320){
					result = 6
				}
			}else if(mouseY > 175*sc && mouseY < 215*sc){
				if(mouseX > sc*105 && mouseX < sc*145){
					result = 7
				}else if(mouseX > sc*155 && mouseX < sc*195){
					result = 8
				}else if(mouseX > sc*205 && mouseX < sc*245){
					result = 9
				}else if(mouseX > sc*255 && mouseX < sc*295){
					result = 10
				}
			}else if(mouseY > 225*sc && mouseY < 265*sc){
				if(mouseX > sc*130 && mouseX < sc*170){
					result = 11
				}else if(mouseX > sc*180 && mouseX < sc*220){
					result = 12
				}else if(mouseX > sc*230 && mouseX < sc*270){
					result = 13
				}
			}
			if(result){
				bids.push(result);
				turn = (turn + 1)%4;
				player.hasBid = true;
			}
		}
	}
	
}

function cutDeck(index){
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
	if(status != "init" && status != "dealing"){
		let t, c = color(0,127);;
		switch(T){
			case "h":
			t = "❤";
			c = color(255,0,0,127);
			break;
			case "s":
			t = "♠";
			break;
			case "d":
			t = "◆";
			c = color(255,0,0,127);
			break;
			case "c":
			t = "♣";
		}
		push();
		fill(c);
		textAlign(CENTER, CENTER);
		textSize(width/5);
		text(t, width/2,height/2);
		pop();
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

function showBids(){
	push();
	for(let i = 0; i < 12; i++){
		let start = i < 5? 80*sc : i < 9? 105*sc : 130*sc;
		let w = 40*sc;
		let x;
		if(i < 5) x = i*(w + 10*sc) + start;
		else if(i < 9) x = (i-5)*(w + 10*sc) + start;
		else x = (i - 9)*(w + 10*sc) + start;
		let y = i < 5? 125*sc : i < 9? 175*sc : 225*sc;
		let v = i < 5? i+2 : i < 9? (i+2)*2 : (i + 2) * 3;
		stroke(0,150);
		strokeWeight(sc);
		fill(255,150);
		rect(x, y, w, w,4*sc);
		if(v < floor(player.score/10)) fill(150,150);
		else fill(0,0,255,150);
		textAlign(CENTER, CENTER);
		textSize(width/20);
		text(v, x+w/2,y+w/2);
	}
	
	pop();
}

function showSlots(){
	for(let i = 0; i < 4; i++){
		if(slots[i].card == null){
			push();
			rectMode(CENTER);
			fill(255,127);
			rect(slots[i].x, slots[i].y, Card.w, Card.h, PI*sc);
			pop();
		}else{
			slots[i].card.x = slots[i].x;
			slots[i].card.y = slots[i].y;
			slots[i].card.show();
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