let deck, players, player, turn ;

function newGame(){
	deck = Card.createDeck();
	deck = Card.shuffle(deck);
	players = [];
	for(let i = 0; i < 4; i++){
		players[i] = new Player(i, !i);
	}
	player = players[0];
	turn = floor(random(4));
}

function runGame(){
	
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