let vals = "A234567890JQK";
class Card{
	constructor(val, suit){
		this.val = val;
		this.suit = suit;
		this.col = "red";
		if (this.suit == "c" || this.suit == "s"){
			this.col = "black";
		}
		this.revealed = false;
		this.x;
		this.y;
		this.w = Card.w;
		this.h = Card.h;
	}
	
	show(){
		push();
		rectMode(CENTER);
		stroke(0);
		strokeWeight(this.w/40);
		if (this.revealed){
			fill(255,255,245);
			rect(this.x,this.y,this.w,this.h,PI * sc);
			noFill();
			rect(this.x, this.y,this.w/1.18, this.h/1.2, PI * sc);
			textAlign(CENTER);
			textSize(this.w * 0.4);
			let col;
			col = this.col == "red" ? color(255,0,0) : 0;
			fill(col);
			let suit;
			switch(this.suit){
				case "h":
				suit = "❤";
				break;
				case "s":
				suit = "♠";
				break;
				case "d":
				suit = "◆";
				break;
				case "c":
				suit = "♣";
			}
			let val;
			val = this.val == "0" ? "10" : this.val;
			text(val + suit, this.x, this.y - this.h * 0.12);
		} else {
			fill(200, 200, 225);
			rect(this.x,this.y,this.w,this.h, PI);
			noFill();
			rect(this.x, this.y,this.w/1.18, this.h/1.2);
			let ly = this.h/2.4;
			line(this.x, this.y - ly, this.x, this.y + ly);
		}
		pop()
	}
	
	reveal(){
		this.revealed = true;
	}
	
	static createDeck(){
		let suits = "hsdc";
		let d = [];
		for (let i = 0; i < 13; i++){
			for (let j = 0; j < 4; j++){
				d[i + j * vals.length] = new Card(vals[i], suits[j]);
			}
		}
		return d
	}
	
	static shuffle(array){
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		}
	return array;
	}
	
	static get w(){
		return width/10;
	}
	
	static get h(){
		return 1.3*width/10;
	}
	
}
