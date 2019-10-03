"use strict";

let balls;
let canvas;
let ctx;
let cube_size;
let cubes;
let degToRad;
let enemies;
let enemyTick;
let enemyDelay;

let radToDeg;
let position;
let player;
let rocks;
let score;
let gameover;
let images;
let player_gun;


const keys = [];

const KEYS = {
	up: 38,
	down: 40,
	right: 39,
	left: 37,
	space: 32
};

const mouse = {
	x:0,
	y:0,
	left: false,
	right: false
};

class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	lengthTo(vector){
		return Math.sqrt((this.x - vector.x)**2 + (this.y - vector.y)**2);
	}

	normalize(vector){
		return new Vector2((this.x - vector.x) / this.lengthTo(vector), (this.y - vector.y) / this.lengthTo(vector));
	}
}

class Object {
	constructor(x, y, width, height, color){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.active = true;
	}

	draw() {
		if(this.active){
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	isTouching(other){
		/*	
			Skilar hvort þetta object og object'ið other (þetta eru kubbar) snertast

			Segjum að þetta hafi x1 og y1 og other hefur x2 og y2 (x1 = this.x, y1 = this.y, x2 = other.x og y2 = other.y) OG
			að this og other hefur width and height (w1 = this.width, h1 = this.height, w2 = other.width og h2 = other.height)
			Þá skilar þessu hvort að:
				x1 + w1 er MEIRA eða JAFNT OG x2
				OG
				x1 er MINNA eða JAFNT OG x2 + w2
			þetta þýðir hvort að staðsetningin í X (báðum hlutum) sé inn í X mengi hlutar
			og svo kemur:
				y1 + h1 er MEIRA eða JAFNT OG y2
				OG
				y1 er MINNA eða JAFNT OG y2 + h2
			sem er sama og hitt nema það gildir með Y
		*/ 
		return (this.active && other.active) && this.x + this.width >= other.x && this.x <= other.x + other.width && this.y + this.height >= other.y && this.y <= other.y + other.height;
	}

}

class Player extends Object{

	constructor(){
		super(canvas.width / 2 - 50, 300, 70, 70, '#fff');
		this.rotation = 0;
	}

	draw() {
		if(this.active){
			ctx.drawImage(images.player, this.x, this.y, this.width, this.height);
		}
	}

}

class Enemy extends Object{
	constructor(){
		let side = Math.round(Math.random());

		let s = 50;

		if(side == 1)
			super(Math.random() * canvas.width + canvas.width, Math.random() * canvas.height, s, s, '#0f0');
		else
			super(Math.random() * canvas.width, Math.random() * canvas.height + canvas.height, s, s, '#0f0');

		this.speed = Math.random() * 10;
		this.velocity = new Vector2((Math.random()-.5)*2, (Math.random()-.5)*2);
		this.gun = new PlayerGun(this);
		this.gun.width = 55;
		this.gun.height = 55/1.5;

		this.tick = 0;
		this.delay = 60 + Math.random() * 100;

	}

	// Þetta notum við bæði í update og render
	draw(){
		if(this.active){
			
			this.x += this.velocity.x * this.speed;
			this.y += this.velocity.y * this.speed;
			let angle = new Vector2(this.x - player.x, this.y - player.y);
			this.gun.x = this.x;
			this.gun.y = this.y;
			if(!gameover){
				this.gun.rotation = Math.atan2(angle.y, angle.x);
				this.gun.draw();
			}
			ctx.drawImage(images.enemy, this.x, this.y, this.width, this.height);
			this.tick++;
			if(this.tick > this.delay && !gameover){
				this.tick = 0;
				this.delay = Math.random() * 100;
				let playerLoc = new Vector2(player.x, player.y);
				let bullet = new Bullet(playerLoc.normalize(new Vector2(this.x, this.y)), 30);
				bullet.x = this.x + bullet.vector.x * bullet.speed;
				bullet.y = this.y + bullet.vector.y * bullet.speed;
				balls.push(bullet);
			}

		}
	}
}

class Rock extends Object {
	constructor(){
		let side = Math.round(Math.random());

		let s = Math.random() * 100 + 50;

		if(side == 1)
			super(Math.random() * canvas.width + canvas.width, Math.random() * canvas.height, s, s, '#0f0');
		else
			super(Math.random() * canvas.width, Math.random() * canvas.height + canvas.height, s, s, '#0f0');
		this.speed = Math.random() * 10;
		this.velocity = new Vector2((Math.random()-.5)*2, (Math.random()-.5)*2);
	}

	draw(){
		if(this.active){
			ctx.drawImage(images.rock, this.x, this.y, this.width, this.height);
			this.x += this.velocity.x * this.speed;
			this.y += this.velocity.y * this.speed;


		}
	}
}

class PlayerGun extends Object {
	constructor(ship){
		super(0, 0, ship.width, ship.height/1.5);
		this.rotation = 0; // snúningur í radians
		this.active = true;
		this.ship = ship;
	}



	draw(){
		if(this.ship.active){
			ctx.save();
			ctx.translate(this.x + (this.ship.width / 2), this.ship.y + (this.ship.height / 2));
			ctx.rotate(Math.PI);
			ctx.rotate(this.rotation);
			ctx.drawImage(images.player_gun, -this.ship.width / 3.5, -this.ship.height / 3.5, this.width, this.height);
			ctx.restore();
		}
	}

	isTouching(){
		return false;
	}
}

class Bullet extends Object{
	constructor(vector, speed){

		super(player.x + (player.width / 2 - 7.5), player.y + (player.height / 2 - 7.5), 15, 15, '#f00');
		this.vector = vector;
		this.speed = speed;
		this.x += this.vector.x * 100;
		this.y += this.vector.y * 100;
	}

	draw(){
		super.draw();
		this.x += this.vector.x * this.speed;
		this.y += this.vector.y * this.speed;

	}
}

degToRad = (deg) => (deg * Math.PI) / 180;
radToDeg = (rad) => (rad / Math.PI) * 180;

function init(){
	for(let i = 0; i < 255; i++){
		keys.push(false);
	}

	enemyTick = 0;
	enemyDelay = 1200;

	canvas = document.getElementById('paint');
	ctx = canvas.getContext('2d');

	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	
	balls = [];
	rocks = [];
	enemies = [];

	images = {
		rock: new Image,
		space: new Image,
		player: new Image,
		player_gun: new Image,
		enemy: new Image
	};

	images.rock.src = 'img/rock.png';
	images.space.src = 'img/wallpaper.jpg';
	images.player.src = 'img/player.png';
	images.player_gun.src = 'img/player_gun.png';
	images.enemy.src = 'img/enemy.png';

	document.addEventListener('contextmenu', (e) => e.preventDefault());
	document.addEventListener('mousemove', (e) => {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	});
	document.addEventListener('keydown', (e) => {keys[e.keyCode] = true});
	document.addEventListener('keyup', (e) => {keys[e.keyCode] = false});

	document.addEventListener('mousedown', (e) => {
		if(e.buttons == 1){
			mouse.left = true;
		} else if (e.buttons == 2) {
			mouse.right = true;
		}
	});

	document.addEventListener('mouseup', (e) => {
		mouse.left = false;
		mouse.right = false;
	});

	player = new Player();
	player_gun = new PlayerGun(player);

	setInterval(update, 1000/60); // 1000/60 eru 60 frames per second

	for(let i = 0; i < 3; i++){
		rocks.push(new Rock());
	}

	canvas.addEventListener('scroll', function(e){
		console.log("Scrolled!");
	});

	score = 0;
	gameover = false;


	enemies.push(new Enemy());
	
}
// gáir hvort hlutur sé kominn útfyrir skjáinn og lætur hann koma hinum meginn við skjáinn í staðinn
function border(obj){
	if(obj.x + obj.width < 0){
		obj.x = canvas.width - 1;
	} else if (obj.x > canvas.width){
		obj.x = -obj.width + 1;
	} else if (obj.y + obj.height < 0){
		obj.y = canvas.height + 1;
	} else if(obj.y > canvas.height){
		obj.y = -obj.height - 1;
	}
}

function update(){
	ctx.fillStyle = '#000';
	//ctx.fillRect(0, 0,  canvas.width, canvas.height);
	ctx.drawImage(images.space, 0, 0);

	player_gun.x = player.x;
	player_gun.y = player.y;

	
	
	let mouseVector = new Vector2(mouse.x, mouse.y);
	let playerVector = new Vector2(player.x, player.y);
	let normalized = mouseVector.normalize(playerVector);
	let angle = new Vector2(player.x - mouse.x, player.y - mouse.y);

	player_gun.rotation = Math.atan2(angle.y, angle.x);
	
	
	
	player_gun.draw();
	player.draw();
	
	
	

	if(!gameover){
		if(mouse.right){
			

			player.x += normalized.x * 10
			player.y += normalized.y * 10;
		}

		if(mouse.left){
			mouse.left = false;
			balls.push(new Bullet(normalized, 30));
		}
	}

	border(player);
	for(let i = 0; i < rocks.length; i++)
		border(rocks[i]);

	for(let i = 0; i < balls.length; i++){
		balls[i].draw();
		for(let j = 0; j < rocks.length; j++){
			if(balls[i].isTouching(rocks[j])){
				rocks[j].active = false;
				balls[i].active = false;
				if(!gameover){
					rocks.push(new Rock());
					rocks.push(new Rock());
					score++;
				}
			}
			if(rocks[j].isTouching(player)){
				player.active = false;
				player_gun.active = false;
				gameover = true;
				rocks[j].active = false;
			}
		}
		if(balls[i].isTouching(player)){
			player.active = false;
			player_gun.active = false;
			balls[i].active = false;
			gameover = true;
		}

		for(let j = 0; j < enemies.length; j++){
			if(balls[i].isTouching(enemies[j])){
				enemies[j].active = false;
				balls[i].active = false;
			}
			
		}

		border(balls[i]);
	}

	
	

	

	for(let i = 0; i < rocks.length; i++){
		rocks[i].draw();
	}

	for(let i = 0; i < enemies.length; i++){
		enemies[i].draw();
		border(enemies[i]);
	}

	ctx.fillStyle = '#fff';
	ctx.font = "30px Arial";
	ctx.fillText("Score: " + score, 10, 40);

	if(gameover){
		ctx.font = "100px Arial";
		ctx.fillStyle = '#f0f';
		ctx.fillText("Game over", canvas.width / 2 - 250, canvas.height / 2 - 50);
	} else {
		enemyTick++;
		if(enemyTick >= enemyDelay){
			enemies.push(new Enemy());
			enemyTick = 0;
			enemyDelay = Math.random() * 900;
		}
	}
}

init();
