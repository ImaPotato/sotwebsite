var games = {
	Bounce: function (canvas) {
		var balls = [];
		var numberBalls;
		var graphics = new ctk.Graphics(canvas);
        var canvasWidth = graphics.getWidth();
        var canvasHeight = graphics.getHeight();
        var timeoutId;
        var loseEnergy;

		function clear(){
            graphics.clearRect(0, 0, canvasWidth, canvasHeight);
		}

		function drawBall(ball){
			graphics.setColor("#8C8C8C");
			graphics.fillCircle(ball.pos.x - ball.radius, ball.pos.y - ball.radius, ball.radius);
		}

		function initaliseBalls(){
			numberBalls = Math.floor(10 + Math.random()*15);
			for(var i = 0; i < numberBalls; i++){
				balls.length++;
				balls[i] = new ball(new Vector2(Math.floor(106 + Math.random()*700), Math.floor(106 + Math.random()*400)), Math.floor(5 + Math.random()*30), new Vector2(Math.floor(5 + Math.random()*100), Math.floor(5 + Math.random()*100)));
			}
		}

		function movement(ball){
			if(ball.pos.x - ball.radius <= 0 || ball.pos.x + (2 * ball.radius) >= canvasWidth){
				ball.pVol.x = ball.pVol.x * -1;
			}
			ball.pos.x = ball.pos.x + ball.pVol.x / (1000/20);
			if(ball.pos.y - ball.radius <= 0 || ball.pos.y + (2 * ball.radius) >= canvasHeight){
				ball.pVol.y = ball.pVol.y * -1;
			}
			ball.pos.y = ball.pos.y + ball.pVol.y / (1000/20);
		}

		function detectCollision(ball, other){
			var dx = other.pos.x - ball.pos.x;
			var dy = other.pos.y - ball.pos.y;
			var rad = ball.radius + other.radius;
			if((dx * dx) + (dy * dy) < (rad * rad)){
				resolveCollision(ball, other);
			}
 		}

 		function resolveCollision(ball, other){
 			var delta = (ball.pos.minusNew(other.pos));
 			var d = Math.sqrt((delta.x * delta.x) + (delta.y * delta.y));
 			var mtd = delta.multiplyEq(((ball.radius + other.radius)-d)/d);
 			var im1 = 1/ball.radius;
 			var im2 = 1/other.radius;

 			ball.pos = ball.pos.plusNew(mtd.multiplyNew(im1/(im1+im2)));
 			other.pos = other.pos.minusNew(mtd.multiplyNew(im2/(im1+im2)));

 			var v = ball.pVol.minusNew(other.pVol);

 			var vn = v.dot(mtd.normalise());

 			if(vn > 0)return;

 			var i = (-(1 + 0.8) * vn) / (im1 + im2);

 			var impulse = mtd.multiplyNew(i);

 			ball.pVol = ball.pVol.plusNew(impulse.multiplyNew(im1));
 			other.pVol = ball.pVol.minusNew(impulse.multiplyNew(im2));
		}	

		function ball(pos, radius, pVol){
			this.pos = pos;
			this.radius = radius;
			this.pVol = pVol;
		}

		function paint(){
			clear();
			for(var i = 0; i < balls.length; i++){
				drawBall(balls[i]);
			}
		}

		this.update = function(){
			for(var i = 0; i < balls.length; i++){
				for(var j = 0; j < balls.length; j++){
					detectCollision(balls[i], balls[j]);
				}
				movement(balls[i]);
			}
			paint();
		}
		this.slow = function(){
			for(var i = 0; i < balls.length; i++){
				balls[i].pVol.x = balls[i].pVol.x * 0.98;
				balls[i].pVol.y = balls[i].pVol.y * 0.98;
			}
		}

		this.initialize = function(){
			console.log(canvasWidth);
			console.log(canvasHeight);
			initaliseBalls();
			timeoutId = setInterval(this.update, 1000/60);
			loseEnergy = setInterval(this.slow, 750);
		}



/*
Copyright (c)2010-2011, Seb Lee-Delisle, sebleedelisle.com
All rights reserved.
*/

		var Vector2 = function (x,y) {
			this.x= x || 0; 
			this.y = y || 0; 
		};

		Vector2.prototype = {
			clone : function () {
			return new Vector2(this.x, this.y);
		},

		reset: function ( x, y ) {
			this.x = x;
			this.y = y;
			return this;
		},

		magnitude : function () {
			return Math.sqrt((this.x*this.x)+(this.y*this.y));
		},

		magnitudeSquared : function () {
			return (this.x*this.x)+(this.y*this.y);
		},

		normalise : function () {
			var m = this.magnitude();
			this.x = this.x/m;
			this.y = this.y/m;
			return this;	
		},
		
		plusEq : function (v) {
			this.x+=v.x;
			this.y+=v.y;
			return this; 
		},

		plusNew : function (v) {
			return new Vector2(this.x+v.x, this.y+v.y); 
		},

		minusEq : function (v) {
			this.x-=v.x;
			this.y-=v.y;
			return this; 
		},

		minusNew : function (v) {
	 		return new Vector2(this.x-v.x, this.y-v.y); 
		},	

		multiplyEq : function (scalar) {
			this.x*=scalar;
			this.y*=scalar;
			return this; 
		},

		multiplyNew : function (scalar) {
			var returnvec = this.clone();
			return returnvec.multiplyEq(scalar);
		},
		dot : function (v) {
			return (this.x * v.x) + (this.y * v.y) ;
		},
		}
	}
}