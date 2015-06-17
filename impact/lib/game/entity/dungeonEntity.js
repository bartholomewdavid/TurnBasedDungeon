ig.module( 
    'game.entity.dungeonEntity' 
)
.requires(
    'impact.entity',
	'game.entity.linemarker',
	'game.entity.tilehighlight'
)
.defines(function(){

ig.DungeonEntity = ig.Entity.extend({
	game: undefined,
	lineEntities: [],
	tileHighlight: undefined,
	utils: undefined,
	speed: {x: 1, y: 1},
	maxVel: {x: 50, y: 250},
	path: [],
	initialCollides: 1,
	initialGravity: ig.Entity.COLLIDES.ACTIVE,
	falling: false,
	
	init: function(x, y, settings) {
		this.utils = new ig.Utils();	
		this.game = settings.game;
		this.parent( x, y, settings );
	},
	
	startMoving: function() {
		this.game.gameState = this.game.GAME_STATES.PLAYER_TURN_ANIMATING;
		this.gravityFactor = 0;
		this.collides = ig.Entity.COLLIDES.NEVER;
		this.removeJumpIndicator();
	},
	
	endMoving: function() {
		this.gravityFactor = this.initialGravity;
		this.collides = this.initialCollides;
		this.game.gameState = this.game.GAME_STATES.PLAYER_TURN_INPUT;
	},
	
    getCoordinates: function() {
		return this.utils.getCoordinates(this.pos);
    },
    
    moveRight: function(val) {
		this.path.push({x: this.pos.x + (16 * val), y: this.pos.y});
    },
    
    moveLeft: function(val) {
		this.path.push({x: this.pos.x - (16 * val), y: this.pos.y});  
    },
    
    climbUpRight: function(val) {
		this.path.push({x: this.pos.x + (16 * val), y: this.pos.y - (16 * val)});
    },
    
    climbUpLeft: function(val) {
		this.path.push({x: this.pos.x - (16 * val), y: this.pos.y - (16 * val)});
    },
    
    climbDownLeft: function(val) {
		this.path.push({x: this.pos.x - (16 * val), y: this.pos.y + (16 * val)});
    },
    
    climbDownRight: function(val) {
		this.path.push({x: this.pos.x + (16 * val), y: this.pos.y + (16 * val)});
    },
    
    jump: function() {
		var path = this.lineEntities;
		if (path.length) {
			for (var i = 0; i < path.length; i++) {
			    var target = path[i];
				var targetCoords = target.getCoordinates();
				var center = { x: targetCoords.x * 16, y: targetCoords.y * 16 } 
				this.path.push(center);
			}
		}
    },
	
	createJumpIndicator: function(e, right) {
		this.removeJumpIndicator();
		var positions = [];
		var c = e.getCoordinates();
		var nextC = undefined;
		var dirX = (right == true) ? 1 : -1;
		var jumpHeight = 1;
		var last = undefined;
		var sur = undefined;
		var collisionMap = this.game.collisionMap;
		
		last = positions.push({x: c.x, y: c.y});
		
		//Finding the apex
		while (jumpHeight > 0) {
			last = positions.push({x: positions[last-1].x+dirX, y: positions[last-1].y-1})
			jumpHeight--;
			sur = this.utils.surroundings(positions[last-1], collisionMap.data);
			//TODO DONT THINK THIS IS ENOUGH
			if (sur[8])
				break;
		}
		
		//Going downward
		while (
				(right == true && (!sur[6] && !sur[3] && !sur[2])) ||
				right == false && (!sur[4] && !sur[1] && !sur[2])) {
			last = positions.push({x: positions[last-1].x+dirX, y: positions[last-1].y+1});
			sur = this.utils.surroundings(positions[last-1], collisionMap.data);
			//Only lets you jump so far, allows falling
			if (positions[last-1].y > c.y)
				break;
		}
			
		while ( positions.length ) {
			var coords = positions.shift();
			this.lineEntities.push(this.game.spawnEntity( EntityLineMarker, 0, 0, {coords: coords}));
			
			if (positions.length == 0)
				this.tileHighlight = this.game.spawnEntity( EntityTileHighlight, 0, 0, { coords: coords});
		}
	},
	
	removeJumpIndicator: function() {
		while (this.lineEntities.length) {
			this.lineEntities.pop().kill();
		}
		if (this.tileHighlight != undefined) {
			this.tileHighlight.kill();
			this.tileHighlight = undefined;
		}
	},
	
	draw: function() {
		this.parent();
		//Custom drawing
		if (this.lineEntities.length) {
			var ctx = ig.system.context;
			var start = this.lineEntities[0];
			//Can be determined by y change
			var peak = this.lineEntities[1];
			var end = this.lineEntities[this.lineEntities.length-1];
			var pHeight = this.size.y / 2;
			var pWidth = this.size.x / 2;
			
			var startX = 
				ig.system.getDrawPos( start.pos.x ) - (this.game.screen.x*ig.system.scale) + pWidth;
			var startY =
				ig.system.getDrawPos( start.pos.y ) - (this.game.screen.y*ig.system.scale) + pHeight;
			var peakX = 
				ig.system.getDrawPos( peak.pos.x ) - (this.game.screen.x*ig.system.scale) + pWidth;
			var peakY =
				ig.system.getDrawPos( peak.pos.y ) - (this.game.screen.y*ig.system.scale) + pHeight - 30; // 30 makes it curvier :3
			var endX = 
				ig.system.getDrawPos( end.pos.x ) - (this.game.screen.x*ig.system.scale) + pWidth;
			var endY =
				ig.system.getDrawPos( end.pos.y ) - (this.game.screen.y*ig.system.scale) + pHeight;
			
			ctx.save();
			ctx.strokeStyle = '#df2326';
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.quadraticCurveTo(peakX, peakY, endX, endY);
			ctx.stroke();
			ctx.restore();
		}
	},
	
	update: function() {
		if (this.path.length) {
			this.startMoving();
			var point = this.path[0];
			var pos = this.pos;
			var x = 0;
			var y = 0;
			var xVel = this.speed.x;
			var yVel = this.speed.y;
			
			//Untested
			if (point.x > pos.x)
				x = (pos.x + xVel > point.x) ? pos.x + xVel - point.x : xVel;
			if (point.x < pos.x)
				x = (pos.x - xVel < point.x) ? pos.x - xVel + point.x : -xVel;
			if (point.y > pos.y)
				y = (pos.y + yVel > point.y) ? pos.y + yVel - point.y : yVel;
			if (point.y < pos.y)
				y = (pos.y - yVel < point.y) ? pos.y - yVel + point.y : -yVel;
				
			pos.x += x;
			pos.y += y;
			
			if (pos.x == point.x && pos.y == point.y) {
				this.path.shift();
			}
				
			if (this.path.length == 0) {
				this.endMoving();
				if (this.standing == true) {
					this.game.gameState = this.game.GAME_STATES.PLAYER_TURN_INPUT;
				} else {
					this.falling = true;
				}
			}
		}
		
		if (this.falling == true && this.standing == true) {
			this.game.gameState = this.game.GAME_STATES.PLAYER_TURN_INPUT;
			this.falling = false;
		}
		
		this.parent();
	},
	
	//Falling?
    handleMovementTrace: function( res ) {
        if( res.collision.y && this.vel.y > 150 ) {
            console.log("Falling Damage");
        }
        this.parent(res);
    },
});

});