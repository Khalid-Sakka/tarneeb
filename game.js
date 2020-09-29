

class Player{
	
	constructor(num, human = false){
		this.num = num;
		this.isHuman = human;
		this.score = 0;
		this.teamMate = null;
		this.hand = [];
	}
	
	partner(p){
		this.teamMate = p;
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