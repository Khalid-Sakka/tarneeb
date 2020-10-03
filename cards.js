let vals = "234567890JQKA";
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
		//img revealed
		this.imgR = createGraphics(this.w,this.h);
		//img hidden
		this.imgH = createGraphics(this.w,this.h);
		
		this.imgR.background(255,0);
		this.imgR.rectMode(CENTER);
		this.imgR.stroke(0);
		this.imgR.strokeWeight(this.w/40);
			this.imgR.fill(255,255,245);
			this.imgR.rect(this.w/2,this.h/2,this.w,this.h,PI * sc);
			this.imgR.noFill();
			this.imgR.rect(this.w/2,this.h/2,this.w/1.18, this.h/1.2, PI * sc);
			this.imgR.textAlign(CENTER);
			this.imgR.textSize(this.w * 0.4);
			let col;
			col = this.col == "red" ? color(255,0,0) : 0;
			this.imgR.fill(col);
			let suitS;
			switch(this.suit){
				case "h":
				suitS = "❤";
				break;
				case "s":
				suitS = "♠";
				break;
				case "d":
				suitS = "◆";
				break;
				case "c":
				suitS = "♣";
			}
			let valS;
			valS = this.val == "0" ? "10" : this.val;
			this.imgR.text(valS + suitS, this.w/2,this.h/2 - this.h * 0.12);
			
			
		this.imgH.background(255,0);
		this.imgH.rectMode(CENTER);
		this.imgH.stroke(0);
		this.imgH.strokeWeight(this.w/40);
			this.imgH.fill(200, 200, 225);
			this.imgH.rect(this.w/2,this.h/2,this.w,this.h, PI);
			this.imgH.noFill();
			this.imgH.rect(this.w/2,this.h/2,this.w/1.18, this.h/1.2);
			let ly = this.h/2.4;
			this.imgH.line(this.w/2,this.h/2 - ly, this.w/2,this.h/2 + ly);
	}
	
	show(){
		push();
		imageMode(CENTER);
		if(this.revealed){
			image(this.imgR, this.x, this.y);
		} else {
			image(this.imgH, this.x, this.y);
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
