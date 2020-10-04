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
	
	bid(){
		let minBid = 2;
		if(this.score >= 40) minBid = 4;
		else if(this.score >= 30) minBid = 3;
		let handStatus = {
			"h" : 0,
			"s" : 0,
			"d" : 0,
			"c" : 0,
			"A" : [],
			"K" : [],
			"superSuit" : []
		};
		
		for(let c of this.hand){
			handStatus[c.suit]++
			if(c.suit == T) handStatus["superSuit"].push(c.val);
			if(handStatus.hasOwnProperty(c.val)) handStatus[c.val].push(c.suit);
		}
		let bid = 0;
		for(let a of handStatus.A){
			if(a != T){
				if(handStatus[a] < 7) bid++;
			}
		}
		for(let k of handStatus.K){
			if(k != T){
				if(handStatus[k] < 5) bid++;
			}
		}
		if(handStatus.superSuit.includes("A")) bid++;
		if(handStatus.superSuit.includes("K") && handStatus[T] > 1) bid++;
		//TODO : make the bidding algorithm a little smarter.
		return max(minBid, bid);
	}
	
	
}