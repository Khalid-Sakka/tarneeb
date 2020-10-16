class Player{
	
	constructor(num, human = false){
		this.num = num;
		this.isHuman = human;
		this.hasBid = false;
		this.hasPlayed = false
		this.score = 0;
		this.teamMate = null;
		this.hand = [];
		this.loot = [];
		this.memory = {};
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
	
	play(suit){
		let av = this.availableMoves(suit);
	}
	
	bid(humanBid){
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
			"Q" : [],
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
				if(handStatus[k] < 4) bid++;
				else if(handStatus[k] < 5 && Math.random() < 2/handStatus[k]) bid++;
			}
		}
		for(let q of handStatus.Q){
			if(q != T){
				if(handStatus[q] == 3 && Math.random() < .5) bid++;
				else if(handStatus[q] == 2 && handStatus.A.includes(handStatus[q])) bid++;
			}
		}
		for(let i = 0; i < vals.length; i++){
			let index = vals.length - i - 1;
			if(handStatus.superSuit.includes(vals[index]) && handStatus[T] > i) bid++;
		}
		
		if(handStatus[T] > 5) bid += handStatus[T] - 5;
		if(handStatus["h"] < 2 && handStatus[T] > handStatus["h"]) bid++
		if(handStatus["s"] < 2 && handStatus[T] > handStatus["s"]) bid++
		if(handStatus["d"] < 2 && handStatus[T] > handStatus["d"]) bid++
		if(handStatus["c"] < 2 && handStatus[T] > handStatus["c"]) bid++
		//TODO : make the bidding algorithm a little smarter.
		return max(minBid, bid);
	}
	
	availableMoves(suit){
		let hasSuit = false;
		let av = [];
		for(let c of this.hand){
			if(c.suit == suit){
				hasSuit = true;
				av.push(c);
			}
		}
		if(!hasSuit){
			for(let c of this.hand){
				av.push(c);
			}
		}
		return av;
	}
	
	
}